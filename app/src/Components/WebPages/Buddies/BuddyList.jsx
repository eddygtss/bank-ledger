import React, {useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardSubtitle,
    CardTitle,
    Col,
    Collapse,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Table
} from "reactstrap";
import { CheckSquare, User, XSquare } from "react-feather";
import { regexAmount } from "../../Utils/utils";
import cogoToast from "cogo-toast";
import '../../../App.css';
import { callApi } from "../../Utils/utils";

const BuddyList = ({ buddyInfo, setReload, reload }) => {
    const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
    const [sendCollapse, setSendCollapse] = useState(false);
    const [requestCollapse, setRequestCollapse] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [form, setForm] = useState({memo: '', recipient: '', amount: '', transactionType: 'SEND', privacySetting: 'PRIVATE'});
    const [requestForm, setRequestForm] = useState({memo: '', responder: '', amount: '', privacySetting: 'PRIVATE'});
    const [privateActive, setPrivateActive] = useState(false);
    const [publicActive, setPublicActive] = useState(false);
    const [privacyDropDown, setPrivacyDropDown] = useState(false);
    const [buddiesCollapse, setBuddiesCollapse] = useState(false);

    const createSendTransaction = (memo, recipient, amount, transactionType, privacySetting) => {
        callApi('send', 'POST', JSON.stringify({memo, recipient, amount, transactionType, privacySetting})).then(result => {
            if (result.status === 201) {
                setReload(!reload);
                setSendCollapse(!sendCollapse);
                setForm({memo: '', recipient: '', amount: '', transactionType: 'SEND', privacySetting: 'PRIVATE'});
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
            } else {
                result.text().then(data => {
                        cogoToast.error('Error: ' + data);
                    }
                )
            }
        });
    };

    const createRequest = (memo, responder, amount, privacySetting) => {
        callApi('request', 'POST', JSON.stringify({memo, responder, amount, privacySetting})).then(result => {
            if (result.status === 201) {
                setReload(!reload);
                setRequestCollapse(!requestCollapse);
                setRequestForm({memo: '', responder: '', amount: '', privacySetting: 'PRIVATE'});
                cogoToast.success('Request successfully sent to ' + responder);
            } else {
                result.text().then(data => {
                    cogoToast.error(`Error ${data ? `: ${data}` : ''}`);
                });
            }
        });
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
            case 'privacy':
                setPrivacyDropDown(!privacyDropDown);
                privacySetting();
                break;
            case 'buddies':
                setBuddiesCollapse(!buddiesCollapse);
                break;
        }
    }

    const privacySetting = () => {
        if (requestForm.privacySetting === 'PRIVATE') {
            setPrivateActive(true);
        } else {
            setPrivateActive(false);
        }
        if (requestForm.privacySetting === 'PUBLIC') {
            setPublicActive(true);
        } else {
            setPublicActive(false);
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

    const onChange = (type, name, value) => {
        const val = value;
        if (type === 'send'){
            if (name === 'amount'){
                if (val === '' || val.match(regexAmount)){
                    setForm({...form, amount: val})
                }
                if (val <= 0 || val[0] === "-" || val > 10000 || val === null){
                    setInvalidAmount(true);
                } else {
                    if (invalidAmount === true) {
                        setInvalidAmount(false);
                    }
                }
            } else {
                setForm({...form, [name]: val});
            }
        } else if (type === 'request'){
            if (name === 'amount'){
                if (val === '' || val.match(regexAmount)){
                    setRequestForm({...requestForm, amount: val})
                }
                if (val <= 0 || val[0] === "-" || val > 10000 || val === null){
                    setInvalidAmount(true);
                } else {
                    if (invalidAmount === true) {
                        setInvalidAmount(false);
                    }
                }
            } else {
                setRequestForm({...requestForm, [name]: val})
            }
        }
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
                <td
                    style={{
                        textAlign: "initial",
                        display: "block",
                        paddingLeft: "12px",
                        whiteSpace: "break-spaces",
                        cursor: "pointer",
                        borderTop: "1px solid #87ceeb"
                    }}
                    onClick={() => {
                        toggle('profile');
                        setSelectedProfile(buddy);
                    }}
                >
                    <div className='p-0' style={{backgroundColor: 'unset'}}><User /> {buddy.firstName} {buddy.lastName}</div>
                    {'\n'}
                    Status: {buddy.status}
                </td>
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
                    <Table
                        className="p-3" style={{backgroundColor: "#edf0f0", borderRadius: "10px"}}
                    >
                        <tbody className="text-center d-block" style={{overflowY: "scroll", height: "125px"}}>
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
                        </tbody>
                    </Table>
            )
        }
    }

    const sendCollapseForm = (user) => {
        return (
            <Container>
                <Dropdown
                    direction="down"
                    toggle={() => toggle('privacy')}
                    isOpen={privacyDropDown}
                    className="text-center mt-2"
                >
                    <DropdownToggle caret>
                        Privacy
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>
                            Privacy Level for Request
                        </DropdownItem>
                        <DropdownItem className="text-center" active={privateActive} onClick={() => setForm({...form, privacySetting: 'PRIVATE'})}>
                            Private
                        </DropdownItem>
                        <DropdownItem className="text-center" active={publicActive} onClick={() => setForm({...form, privacySetting: 'PUBLIC'})}>
                            Public
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Message</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange('send', e.target.name, e.target.value)}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="text" name="amount" invalid={invalidAmount} value={form.amount} bsSize="lg" inputMode="decimal"
                                   onChange={e => onChange('send', e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidAmount || form.memo === "" || form.amount === ''}
                        onClick={() =>
                            createSendTransaction(
                                form.memo,
                                user.toLowerCase(),
                                form.amount,
                                "SEND",
                                form.privacySetting)}>Send</Button>
            </Container>
        )
    }

    const requestCollapseForm = (user) => {
        return (
            <Container>
                <Dropdown
                    direction="down"
                    toggle={() => toggle('privacy')}
                    isOpen={privacyDropDown}
                    className="text-center mt-2"
                >
                    <DropdownToggle caret>
                        Privacy
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>
                            Privacy Level for Request
                        </DropdownItem>
                        <DropdownItem className="text-center" active={privateActive} onClick={() => setRequestForm({...requestForm, privacySetting: 'PRIVATE'})}>
                            Private
                        </DropdownItem>
                        <DropdownItem className="text-center" active={publicActive} onClick={() => setRequestForm({...requestForm, privacySetting: 'PUBLIC'})}>
                            Public
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Message</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange('request', e.target.name, e.target.value)}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input name="amount" invalid={invalidAmount} value={requestForm.amount} bsSize="lg" inputMode="decimal"
                                   onChange={e => onChange('request', e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>

                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidAmount || requestForm.memo === '' || requestForm.amount === ''} onClick={() => createRequest(
                    requestForm.memo,
                    user.toLowerCase(),
                    requestForm.amount,
                    requestForm.privacySetting)}>Request</Button>
            </Container>
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
                        <Card className="p-3">
                            <CardTitle>
                                <h2>{profile.firstName} {profile.lastName}</h2>
                            </CardTitle>
                            <CardSubtitle>
                                Username: {profile.username}
                            </CardSubtitle>
                            <CardBody>
                                <p>Status: {profile.status ? profile.status : 'Hi, I\'m new to Gem Banking!'}</p>
                                <br /><br />
                                <Button color="danger" onClick={() => {
                                    toggle('send');
                                    setRequestCollapse(false);
                                }}>
                                    Send Money
                                </Button>
                                {' '}
                                <Button color="success" onClick={() => {
                                    toggle('request');
                                    setSendCollapse(false);
                                }}>
                                    Request Money
                                </Button>
                                <Collapse isOpen={sendCollapse || requestCollapse}>
                                    {sendCollapse &&
                                    sendCollapseForm(profile.documentId.substring(5))
                                    }
                                    {requestCollapse &&
                                    requestCollapseForm(profile.documentId.substring(5))
                                    }
                                </Collapse>
                            </CardBody>
                        </Card>
                    }
                </OffcanvasBody>
            </Offcanvas>
        )
    }


    return (
        <Col sm='4' md='5' lg='4'>
            <Card
                body
                inverse
                className="roundedBuddies p-1"
            >
                <CardTitle tag="h5" onClick={() => toggle('buddies')} style={{cursor: "pointer"}}>
                    Your Buddies ({buddyInfo.documentId ? getBuddyListEntries().length : 0})
                </CardTitle>
                <Collapse isOpen={buddiesCollapse}>
                    {getBuddyRequests()}
                    <Table
                        className="p-3" style={{backgroundColor: "#edf0f0", borderRadius: "10px"}}>
                        <tbody className="text-center d-block" style={{overflowY: "scroll", height: "375px"}}>
                        {showBuddies()}
                        {profileSidebar(selectedProfile)}
                        </tbody>
                    </Table>
                </Collapse>
            </Card>
        </Col>
    )
}
export default BuddyList;