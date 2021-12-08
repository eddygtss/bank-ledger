import React, {useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col, Collapse, Container, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Table
} from "reactstrap";
import {CheckSquare, User, XSquare} from "react-feather";
import cogoToast from "cogo-toast";
import { callApi } from "../../../utils";

const BuddyList = ({ buddyInfo, setReload, reload }) => {
    const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [sendCollapse, setSendCollapse] = useState(false);
    const [requestCollapse, setRequestCollapse] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});

    const createSendTransaction = (memo, recipient, amount, transactionType) => {
        callApi('send', 'POST', JSON.stringify({memo, recipient, amount, transactionType})).then(result => {
            if (result.status === 201) {
                setSendCollapse(!sendCollapse)
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
            } else {
                result.text().then(data => {
                        cogoToast.error('Error: ' + data);
                    }
                )
            }
        });
    };

    const toggle = (component) => {
        switch (component) {
            case 'profile':
                setProfileSidebarOpen(!profileSidebarOpen);
                break;
            case 'send':
                setSendCollapse(!sendCollapse);
                break;
            case 'request':
                setRequestCollapse(!requestCollapse);
                break;
        }
    }

    const showInvalidAmountFeedback = () => {
        if (invalidAmount){
            return (
                <FormFeedback className="position-relative">
                    Your amount must be more than $0 and less than $10,000.
                </FormFeedback>
            )
        }
    }

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
        if (name === "amount"){
            if (value < 0.01 || value[0] === "-" || value > 10000){
                setInvalidAmount(!invalidAmount);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(!invalidAmount);
                }
            }
        }
    };

    const approveRequest = (request) => {
        callApi('approve-buddy', 'POST', request).then(result => {
            if (result.status === 200) {
                setReload(!reload)
                cogoToast.success('Buddy request approved.');
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error approving request account: ${data.message}`);
                });
            }
        });
    };

    const denyRequest = (request) => {
        callApi('deny-buddy', 'POST', request).then(result => {
            if (result.status === 200) {
                setReload(!reload)
                cogoToast.success('Buddy request denied.');
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error denying request account: ${data.message}`);
                });
            }
        });
    };
    const showBuddies = () => {
        if (buddyInfo.documentId && getBuddyListEntries().length > 0){
            return getBuddyListEntries();
        } else {
            return getBuddies();
        }
    }
    const getBuddies = () => {
        return (
            <p className="mb-0">You currently have no buddies, try adding some!</p>
        )
    }
    const getBuddyListEntries = () => {
        return buddyInfo.documentId && buddyInfo.buddyList.map((buddy) => {
            return (
                <tr style={{textAlign: "initial", display: "block", paddingLeft: "12px", whiteSpace: "break-spaces"}}>
                    {buddy.firstName} {buddy.lastName} <User style={{cursor: "pointer"}} onClick={() => toggle('profile')} />
                    {'\n'}
                    Status: {buddy.status}
                    {profileSidebar(buddy)}
                </tr>
            )
        })
    }
    const getPendingBuddyRequests = () => {
        return buddyInfo.documentId && buddyInfo.buddyRequests.filter(request => {
            const status = request.requestStatus.toLowerCase();
            return status.includes('pending');
        })
    }
    const approveButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <CheckSquare style={{cursor: "pointer"}} color='green' onClick={() => approveRequest(request.id)}/>
            )
        }
    }
    const denyButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <XSquare color='red' style={{cursor: "pointer"}} onClick={() => denyRequest(request.id)}/>
            )
        }
    }

    const getBuddyRequests = () => {
        if (buddyInfo.documentId && getPendingBuddyRequests().length > 0) {
            return (
                <>
                    {buddyInfo.documentId &&
                    <td colSpan="2" className="p-0 fw-bold">
                        Buddy Requests
                    </td>
                    }
                    {
                        buddyInfo.documentId && getPendingBuddyRequests().map((request) => {
                                if (request.requester === buddyInfo.documentId.substring(5)) {
                                    return (
                                        <>
                                            <tr style={{
                                                whiteSpace: 'break-spaces',
                                                textAlign: 'center'
                                            }}>
                                                <td className="p-1">{request.responder.toUpperCase() + '\n' + request.memo}</td>
                                                <td className="align-middle p-1">{request.requestStatus + '\n'}{approveButton(request)} {denyButton(request)}</td>
                                            </tr>
                                        </>
                                    )
                                } else {
                                    return (
                                        <>
                                            <tr className="p-0" style={{
                                                whiteSpace: 'break-spaces',
                                                textAlign: 'center'
                                            }}>
                                                <td className="p-1">{request.requester.toUpperCase() + '\n' + request.memo}</td>
                                                <td className="align-middle p-1">{request.requestStatus + '\n'}{approveButton(request)} {denyButton(request)}</td>
                                            </tr>
                                        </>
                                    )
                                }
                            }
                        )
                    }
                </>
            )
        }
    }

    const sendCollapseForm = (user) => {
        return (
            <>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Message</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange(e.target.name, e.target.value)}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number" name="amount" invalid={invalidAmount} value={form.amount} bsSize="lg"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidAmount || form.memo === ""}
                        onClick={() =>
                            createSendTransaction(
                                form.memo,
                                user.toLowerCase(),
                                form.amount,
                                "SEND")}>Send Funds</Button>
            </>
        )
    }

    const profileSidebar = (profile) => {
        return (
            <Offcanvas toggle={() => toggle('profile')} isOpen={profileSidebarOpen} direction="end">
                <OffcanvasHeader toggle={() => toggle('profile')}>
                    <h1 className="text-center">Buddy Profile</h1>
                </OffcanvasHeader>
                <OffcanvasBody className='p-1 text-center'>
                    {profile.documentId &&
                        <Card>
                            <CardTitle>
                                <h2>{profile.firstName} {profile.lastName}</h2>
                            </CardTitle>
                            <CardSubtitle>
                                Username: {profile.username}
                            </CardSubtitle>
                            <CardBody>
                                Status: {profile.status ? profile.status : 'Hi, I\'m new to Gem Banking!'}<br />
                                <Button color="error" onClick={() => toggle('send')}>
                                    Send Money
                                </Button>
                                <Button color="success" onClick={() => toggle('request')}>
                                    Request Money
                                </Button>
                                <br />
                                <Collapse isOpen={sendCollapse}>
                                    {sendCollapseForm(profile.documentId.substring(5))}
                                </Collapse>
                            </CardBody>
                        </Card>
                    }
                </OffcanvasBody>
            </Offcanvas>
        )
    }


    return (
        <Col sm='4'>
            <Card
                body
                inverse
                style={{
                    backgroundColor: '#333',
                    borderColor: '#333',
                    height: '700px'
                }}
                className="pl-1 pr-1"
            >
                <CardTitle tag="h5">
                    Your Buddies
                </CardTitle>
                <Table
                    className="bdr table-warning p-3"
                >
                    <tbody className="text-center">
                    {getBuddyRequests()}
                    </tbody>
                </Table>
                <Table
                    className="bdr table-info p-3">
                    <tbody className="text-center">
                    {showBuddies()}
                    </tbody>
                </Table>
            </Card>
        </Col>
    )
}
export default BuddyList;