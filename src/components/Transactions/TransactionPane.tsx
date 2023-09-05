import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  const handleCheckboxChange = async (newValue: boolean) => {
    // Update the local state immediately
    setApproved(newValue)

    // Send the approval status update to the server
    try {
      await consumerSetTransactionApproval({
        transactionId: transaction.id,
        newValue,
      })
    } catch (error) {
      // Handle any errors from the server if necessary
      console.error("Error updating approval status:", error)
      // Revert the local state to its previous value on error
      setApproved(!newValue)
      alert(error)
    }
  }

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={() => handleCheckboxChange(!approved)}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
