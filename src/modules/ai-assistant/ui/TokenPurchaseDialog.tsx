import { useState } from 'react';
import { Zap, Sparkles, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAIStore } from '@/app/store/ai.store';
import { useI18n } from '@/shared/context/I18nContext';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface TokenPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PackType = 'starter' | 'standard' | 'large';

interface TokenPack {
  type: PackType;
  tokens: number;
  price: number;
  pricePerMillion: number;
  popular?: boolean;
}

const tokenPacks: TokenPack[] = [
  { type: 'starter', tokens: 100000, price: 2, pricePerMillion: 20 },
  { type: 'standard', tokens: 500000, price: 8, pricePerMillion: 16, popular: true },
  { type: 'large', tokens: 1500000, price: 20, pricePerMillion: 13.33 },
];

export function TokenPurchaseDialog({ open, onOpenChange }: TokenPurchaseDialogProps) {
  const { t } = useI18n();
  const { purchaseTokens, loading } = useAIStore();
  const [selectedPack, setSelectedPack] = useState<PackType>('standard');
  const [purchasing, setPurchasing] = useState(false);

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    return `${(tokens / 1000).toFixed(0)}K`;
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const checkoutUrl = await purchaseTokens(selectedPack);
      toast.success(t('AI_ASSISTANT.TOKENS.PURCHASE_STARTED'));
      // Redirect to checkout or open in new tab
      window.location.href = checkoutUrl;
    } catch {
      toast.error(t('AI_ASSISTANT.TOKENS.PURCHASE_ERROR'));
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            {t('AI_ASSISTANT.TOKENS.PURCHASE_TITLE')}
          </DialogTitle>
          <DialogDescription>
            {t('AI_ASSISTANT.TOKENS.PURCHASE_DESCRIPTION')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {tokenPacks.map((pack) => (
            <button
              key={pack.type}
              onClick={() => setSelectedPack(pack.type)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                selectedPack === pack.type
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-border hover:border-purple-500/50'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-2 right-4 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full">
                  {t('AI_ASSISTANT.TOKENS.POPULAR')}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{formatTokens(pack.tokens)} {t('AI_ASSISTANT.TOKENS.TOKENS')}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${pack.pricePerMillion.toFixed(2)} / 1M {t('AI_ASSISTANT.TOKENS.TOKENS')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">${pack.price}</span>
                  {selectedPack === pack.type && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            {t('COMMON.ACTIONS.CANCEL')}
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={purchasing || loading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {purchasing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('AI_ASSISTANT.TOKENS.PROCESSING')}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {t('AI_ASSISTANT.TOKENS.BUY_NOW')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
