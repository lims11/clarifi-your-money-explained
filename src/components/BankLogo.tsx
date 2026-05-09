import { useState } from 'react';
import { bankLogoUrl, findBankByInstitution, getBankById } from '@/data/ukBanks';

interface BankLogoProps {
  bankId?: string;
  institution?: string | null;
  fallbackLetter?: string;
  fallbackColour?: string;
  size?: number;
  rounded?: 'full' | 'xl';
  className?: string;
}

/**
 * Renders the real bank logo via Clearbit (logo.clearbit.com/{domain}).
 * Falls back gracefully to a coloured circle with the bank's initial.
 */
export function BankLogo({
  bankId,
  institution,
  fallbackLetter,
  fallbackColour,
  size = 40,
  rounded = 'full',
  className = '',
}: BankLogoProps) {
  const bank = bankId ? getBankById(bankId) : findBankByInstitution(institution);
  const url = bankLogoUrl(bank?.domain);
  const colour = bank?.colour || fallbackColour || '#7F77DD';
  const letter = bank?.letter || fallbackLetter || (institution?.[0] || '?').toUpperCase();
  const [errored, setErrored] = useState(false);

  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-xl';
  const sizeStyle = { width: size, height: size };

  if (!url || errored) {
    return (
      <div
        className={`${radiusClass} flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
        style={{ ...sizeStyle, backgroundColor: colour, fontSize: Math.max(10, size * 0.36) }}
      >
        {letter}
      </div>
    );
  }

  return (
    <div
      className={`${radiusClass} overflow-hidden flex items-center justify-center bg-white border flex-shrink-0 ${className}`}
      style={sizeStyle}
    >
      <img
        src={url}
        alt={bank?.name || institution || 'Bank logo'}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setErrored(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
