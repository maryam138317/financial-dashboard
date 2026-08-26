import TransactionTable from "@/components/transactions/table";

export default function TransactionPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all of your income, expenses, and savings.
        </p>
      </div>

      <TransactionTable />
    </main>
  );
}
