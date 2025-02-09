import React from "react";
import {Badge, Card, CardTitle, Col, Table} from "reactstrap";
import '../../../App.css';

const BuddyFeed = ({ feedTransactions }) => {
    const getFilteredTransactions = () => {
        return feedTransactions.length > 0 && feedTransactions.filter(transaction => {
            const type = transaction.transactionType.toLowerCase();
            const status = transaction.transactionStatus.toLowerCase();
            return (type.includes('send') && status.includes('sent')) || status.includes('received');
        })
    }

    const sortedFeed = () => {
        return getFilteredTransactions().sort((a,b) => {
            return new Date(a.date).getDate() -
                new Date(b.date).getDate()
        }).reverse();
    }

    const getBuddyTransactionEntries = () => {
        return feedTransactions.length > 0 && sortedFeed().map((transaction) => {
                return (
                    <td
                        className="p-2"
                        style={{
                            textAlign: "center",
                            display: "block",
                            whiteSpace: "break-spaces",
                            borderTop: "1px solid #87ceeb"
                        }}
                    >
                        <div className='p-0' style={{backgroundColor: 'unset'}}>
                            {transaction.senderFullName} paid {transaction.recipientFullName}{'\n'}
                            <div style={{fontSize: "10px"}}>{new Date(transaction.date).getMonth() + 1}/{new Date(transaction.date).getDate()} <Badge>{transaction.privacySetting}</Badge></div>
                        </div>
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
                    <tbody className="text-center d-block" style={{overflowY: "scroll", height: "630px"}}>
                    {showBuddies()}
                    </tbody>
                </Table>
            </Card>
        </Col>
    )
}
export default BuddyFeed;