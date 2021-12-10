import React, { useState } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Collapse,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import {Codepen, Edit} from "react-feather";
import cogoToast from "cogo-toast";
import { callApi } from "../../Utils/utils";

const MyProfile = ({profile, reload, setReload}) => {
    const [usernameCol, setUsernameCol] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');

    const updateUsername = (newUsername) => {
        callApi('update-username', 'PUT', newUsername).then(result => {
            if (result.status === 200) {
                setReload(!reload);
                setUpdatedUsername('');
                setUsernameCol(false);
                cogoToast.success('Updated username to ' + newUsername);
            } else {
                result.text().then((data) => {
                    cogoToast.error(data);
                })
            }})
    }
    const updateStatus = (status) => {
        callApi('update-status', 'PUT', status).then(result => {
            if (result.status === 200) {
                setReload(!reload);
                setUpdatedStatus('');
            } else {
                result.json().then((data) => {
                    cogoToast.error(`Error updating status${data.message ? `: ${data.message}` : ''}`);
                })
            }})
    }

    const toggle = (component) => {
        switch (component) {
            case 'username':
                setUsernameCol(!usernameCol);
                break;
        }
    }

    return (
        <>
        {profile.documentId &&
                <Card className="text-center">
                    <CardTitle>
                        <h2 className="mt-2">{profile.firstName} {profile.lastName}</h2>
                    </CardTitle>
                    <CardSubtitle>
                        Username: {profile.username} <Edit style={{cursor: "pointer"}}
                                                           onClick={() => toggle('username')} />
                        <Collapse isOpen={usernameCol}>
                            <div className='text-center d-inline-block' style={{maxWidth: "300px"}}>
                                <FormGroup floating>
                                    <Input
                                        type="text"
                                        name="username"
                                        placeholder="Set Username"
                                        value={updatedUsername}
                                        bsSize="sm"
                                        onChange={(e) =>
                                            setUpdatedUsername(e.target.value)
                                        }
                                    />
                                    <Label for="username">Set Username</Label>
                                </FormGroup>
                            </div>
                            <Button color='info' disabled={!updatedUsername} onClick={() =>
                                updateUsername(updatedUsername)
                            }>Update</Button>
                        </Collapse>
                    </CardSubtitle>
                    <CardBody>
                        <p>Status: {profile.status}</p>
                        <br />
                        <FormGroup floating>
                            <Input
                                type="text"
                                name="status"
                                placeholder="What's on your mind?"
                                value={updatedStatus}
                                bsSize="sm"
                                onChange={(e) =>
                                    setUpdatedStatus(e.target.value)
                                }
                            />
                            <Label for="status">What's on your mind?</Label>
                        </FormGroup>
                        <Button color='info' disabled={!updatedStatus} onClick={() =>
                            updateStatus(updatedStatus)
                        }>Update</Button>
                    </CardBody>
                </Card>
        }
        </>
    )
}
export default MyProfile;