import React from "react";
import {Card, CardTitle, Col, Table} from "reactstrap";
import '../../../App.css';

const BuddyFeed = ({ feedTransactions }) => {
    const getBuddyTransactionEntries = () => {
        return feedTransactions.length > 0 && feedTransactions.map((transaction) => {
                return (
                    <td
                        style={{
                            textAlign: "center",
                            display: "block",
                            paddingLeft: "12px",
                            whiteSpace: "break-spaces",
                            borderTop: "1px solid #87ceeb"
                        }}
                    >
                        <div className='p-0' style={{backgroundColor: 'unset'}}>{transaction.senderFullName} sent {transaction.recipientFullName} ${transaction.amount}</div>
                        {'\n'}
                        {transaction.memo}
                    </td>
                )

        })
    }
    const showBuddies = () => {
        if (feedTransactions.length > 0 && getBuddyTransactionEntries().length > 0){
            return getBuddyTransactionEntries();
        } else {
            return getBuddyTransactions();
        }
    }
    const getBuddyTransactions = () => {
        return (
            <p className="mb-0">Once your buddies start making transactions and set them to public you'll see them here!</p>
        )
    }

    return (
        <Col sm='4' md='7' lg='8'>
            <Card
                body
                inverse
                style={{
                    height: '700px'
                }}
                className="roundedBuddies pl-1 pr-1"
            >
                <CardTitle tag="h5">
                    Your Feed
                </CardTitle>
                <Table
                    className="p-3" style={{backgroundColor: "#edf0f0", borderRadius: "10px"}}>
                    <tbody className="text-center">
                    {showBuddies()}
                    </tbody>
                </Table>
            </Card>
        </Col>
    )
}
export default BuddyFeed;