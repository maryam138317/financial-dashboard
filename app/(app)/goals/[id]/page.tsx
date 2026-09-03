import GoalTransactionView from "./goal-transaction-client";

export default async function GoalTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GoalTransactionView goalId={id} />;
}