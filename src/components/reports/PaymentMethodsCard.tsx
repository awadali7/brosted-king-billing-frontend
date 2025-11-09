interface PaymentMethodsCardProps {
    paymentMethods: Array<{
        payment_method: string;
        transaction_count: string;
        total_amount: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

const colors: Record<string, string> = {
    cash: "bg-green-500",
    card: "bg-blue-500",
};

export default function PaymentMethodsCard({
    paymentMethods,
    formatCurrency,
}: PaymentMethodsCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>💳</span>Payment Methods
            </h3>
            <div className="space-y-3">
                {paymentMethods.map((method, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    colors[method.payment_method] ||
                                    "bg-purple-500"
                                }`}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] capitalize">
                                    {method.payment_method}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                    {method.transaction_count} transactions
                                </p>
                            </div>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {formatCurrency(method.total_amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
