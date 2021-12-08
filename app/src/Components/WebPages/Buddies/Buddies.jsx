import React, {useEffect, useState} from 'react';
import BuddyList from "./BuddyList";
import BuddyFeed from "./BuddyFeed";
import cogoToast from "cogo-toast";
import { AddBuddyModal } from "../../Modal/AddBuddyModal";
import { Button, Row } from "reactstrap";
import { callApi } from "../../../utils";

const Buddies = ({ reload, setReload }) => {
    const [buddyInfo, setBuddyInfo] = useState({});
    const [addBuddyModal, setAddBuddyModal] = useState(false);
    const [message, setMessage] = useState('');

    const toggle = () => {
        setAddBuddyModal(!addBuddyModal);
    }

    useEffect(() => {
        callApi('buddies').then(result => {
            if (result.status === 200) {
                result.json().then(data => {
                    setBuddyInfo(data);
                });
            } else {
                cogoToast.error('There was an error retrieving your buddies.')
            }
        });
    }, [reload]);



    return (
        <>
            <div className="justify-content-between text-center">
                <Button
                    className="mb-3"
                    style={{width: "fit-content", height: "fit-content"}}
                    color="primary"
                    outline
                    onClick={() => toggle()}
                >
                    Add Buddies
                </Button>
                <AddBuddyModal addBuddyModal={addBuddyModal} setAddBuddyModal={setAddBuddyModal} buddyInfo={buddyInfo} />
            </div>
            <Row className='justify-content-between text-center' sm="1" lg="2">
                <BuddyList buddyInfo={buddyInfo} setReload={setReload} reload={reload} />
                <br />
                <BuddyFeed buddyInfo={buddyInfo} />
            </Row>
        </>
    )
}
export default Buddies;