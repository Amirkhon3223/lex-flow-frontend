import { useState, useEffect } from 'react';
import { useTrustStore } from '@/app/store/trust.store';
import type {
  TrustAccount,
  TrustTransaction,
  TrustTransactionType,
  TrustAccountStatus,
  CreateTrustAccountRequest,
  CreateTrustTransactionRequest,
} from '@/app/types/trust/trust.interfaces';
import { useI18n } from '@/shared/context/I18nContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import {
  DollarSign,
  Plus,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const statusColors: Record<TrustAccountStatus, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  frozen: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
};

const transactionTypeColors: Record<TrustTransactionType, string> = {
  deposit: 'bg-green-100 text-green-800 border-green-200',
  interest: 'bg-green-100 text-green-800 border-green-200',
  refund: 'bg-green-100 text-green-800 border-green-200',
  withdrawal: 'bg-red-100 text-red-800 border-red-200',
  fee_deduction: 'bg-red-100 text-red-800 border-red-200',
  transfer: 'bg-blue-100 text-blue-800 border-blue-200',
};

const isPositiveTransaction = (type: TrustTransactionType): boolean =>
  type === 'deposit' || type === 'interest' || type === 'refund';

export default function TrustAccountsView() {
  const { t } = useI18n();

  const {
    accounts,
    selectedAccount,
    transactions,
    summary,
    loading,
    fetchAccounts,
    createAccount,
    deleteAccount,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
    fetchSummary,
    selectAccount,
  } = useTrustStore();

  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);

  const [accountForm, setAccountForm] = useState<CreateTrustAccountRequest>({
    name: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    notes: '',
  });

  const [transactionForm, setTransactionForm] = useState<CreateTrustTransactionRequest>({
    trustAccountId: '',
    clientId: '',
    caseId: '',
    type: 'deposit',
    amount: 0,
    description: '',
    reference: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAccounts();
    fetchSummary();
  }, [fetchAccounts, fetchSummary]);

  const handleSelectAccount = (account: TrustAccount) => {
    selectAccount(account);
    fetchTransactions(account.id);
  };

  const handleCreateAccount = async () => {
    if (!accountForm.name.trim()) return;
    try {
      await createAccount(accountForm);
      setAccountForm({ name: '', bankName: '', accountNumber: '', routingNumber: '', notes: '' });
      setCreateAccountOpen(false);
      await fetchSummary();
    } catch {
      /* handled by store */
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      await fetchSummary();
    } catch {
      /* handled by store */
    }
  };

  const handleCreateTransaction = async () => {
    if (!transactionForm.trustAccountId || !transactionForm.clientId || transactionForm.amount <= 0) return;
    try {
      await createTransaction(transactionForm);
      setTransactionForm({
        trustAccountId: selectedAccount?.id ?? '',
        clientId: '',
        caseId: '',
        type: 'deposit',
        amount: 0,
        description: '',
        reference: '',
        transactionDate: new Date().toISOString().split('T')[0],
      });
      setAddTransactionOpen(false);
      await fetchSummary();
    } catch {
      /* handled by store */
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      await fetchSummary();
      await fetchAccounts();
    } catch {
      /* handled by store */
    }
  };

  const totalClients = summary?.accounts.reduce((sum, a) => sum + a.clientCount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('TRUST.TITLE')}</h1>
        <div className="flex gap-2">
          <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('TRUST.CREATE_ACCOUNT')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('TRUST.CREATE_ACCOUNT')}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>{t('TRUST.ACCOUNTS')}</Label>
                  <Input
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('TRUST.BANK_NAME')}</Label>
                  <Input
                    value={accountForm.bankName}
                    onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('TRUST.ACCOUNT_NUMBER')}</Label>
                  <Input
                    value={accountForm.accountNumber}
                    onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('TRUST.ROUTING_NUMBER')}</Label>
                  <Input
                    value={accountForm.routingNumber}
                    onChange={(e) => setAccountForm({ ...accountForm, routingNumber: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('TRUST.DESCRIPTION')}</Label>
                  <Input
                    value={accountForm.notes}
                    onChange={(e) => setAccountForm({ ...accountForm, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateAccount} disabled={!accountForm.name.trim() || loading}>
                  {t('TRUST.CREATE_ACCOUNT')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {selectedAccount && (
            <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() =>
                    setTransactionForm((prev) => ({ ...prev, trustAccountId: selectedAccount.id }))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('TRUST.ADD_TRANSACTION')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('TRUST.ADD_TRANSACTION')}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.TRANSACTIONS')}</Label>
                    <Select
                      value={transactionForm.type}
                      onValueChange={(value) =>
                        setTransactionForm({ ...transactionForm, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deposit">{t('TRUST.DEPOSIT')}</SelectItem>
                        <SelectItem value="withdrawal">{t('TRUST.WITHDRAWAL')}</SelectItem>
                        <SelectItem value="interest">{t('TRUST.INTEREST')}</SelectItem>
                        <SelectItem value="fee_deduction">{t('TRUST.FEE_DEDUCTION')}</SelectItem>
                        <SelectItem value="refund">{t('TRUST.REFUND')}</SelectItem>
                        <SelectItem value="transfer">{t('TRUST.TRANSFER')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.CLIENT')}</Label>
                    <Input
                      value={transactionForm.clientId}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, clientId: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.CASE')}</Label>
                    <Input
                      value={transactionForm.caseId}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, caseId: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.AMOUNT')}</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={transactionForm.amount || ''}
                      onChange={(e) =>
                        setTransactionForm({
                          ...transactionForm,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.DESCRIPTION')}</Label>
                    <Input
                      value={transactionForm.description}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.REFERENCE')}</Label>
                    <Input
                      value={transactionForm.reference}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, reference: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>{t('TRUST.DATE')}</Label>
                    <Input
                      type="date"
                      value={transactionForm.transactionDate}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, transactionDate: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCreateTransaction}
                    disabled={
                      !transactionForm.clientId.trim() ||
                      transactionForm.amount <= 0 ||
                      loading
                    }
                  >
                    {t('TRUST.ADD_TRANSACTION')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('TRUST.TOTAL_BALANCE')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.total ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('TRUST.ACCOUNTS')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('TRUST.CLIENTS_COUNT')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <h2 className="text-lg font-semibold">{t('TRUST.ACCOUNTS')}</h2>
          {accounts.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">{t('TRUST.NO_ACCOUNTS')}</p>
          )}
          {accounts.map((account) => (
            <Card
              key={account.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedAccount?.id === account.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectAccount(account)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{account.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[account.status]}>{t(`TRUST.${account.status.toUpperCase() as 'ACTIVE' | 'FROZEN' | 'CLOSED'}`)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAccount(account.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1 text-sm">
                  {account.bankName && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {account.bankName}
                    </div>
                  )}
                  <div className="mt-1 text-lg font-semibold">
                    {formatCurrency(account.totalBalance)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">{t('TRUST.TRANSACTIONS')}</h2>
          {!selectedAccount && (
            <p className="text-sm text-muted-foreground">{t('TRUST.NO_ACCOUNTS')}</p>
          )}
          {selectedAccount && transactions.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">{t('TRUST.NO_TRANSACTIONS')}</p>
          )}
          {selectedAccount && transactions.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.DATE')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.TRANSACTIONS')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.CLIENT')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.CASE')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.DESCRIPTION')}</th>
                    <th className="px-4 py-3 text-left font-medium">{t('TRUST.REFERENCE')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('TRUST.AMOUNT')}</th>
                    <th className="px-4 py-3 text-right font-medium">{t('TRUST.RUNNING_BALANCE')}</th>
                    <th className="px-4 py-3 text-center font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(tx.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={transactionTypeColors[tx.type]}>
                          {t(`TRUST.${tx.type.toUpperCase() as Uppercase<TrustTransactionType>}`)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{tx.clientName}</td>
                      <td className="px-4 py-3">{tx.caseName}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{tx.description}</td>
                      <td className="px-4 py-3">{tx.reference}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {isPositiveTransaction(tx.type) ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <span
                            className={
                              isPositiveTransaction(tx.type) ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {formatCurrency(tx.amount)}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {formatCurrency(tx.runningBalance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeleteTransaction(tx.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {summary && summary.accounts.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{t('TRUST.SUMMARY')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary.accounts.map((sa) => (
                <Card key={sa.accountId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{sa.accountName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="text-lg font-semibold">{formatCurrency(sa.totalBalance)}</div>
                      <div className="text-muted-foreground">
                        {t('TRUST.CLIENTS_COUNT')}: {sa.clientCount}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
