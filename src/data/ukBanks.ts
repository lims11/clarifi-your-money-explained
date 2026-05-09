export interface BankData {
  id: string;
  name: string;
  colour: string;
  letter: string;
  domain?: string;
  statementFormats: ('pdf' | 'csv' | 'xlsx' | 'ofx' | 'qif')[];
  csvColumns?: {
    date: string;
    description: string;
    debit?: string;
    credit?: string;
    amount?: string;
    balance?: string;
  };
  pdfHint?: string;
}

export const UK_BANKS: BankData[] = [
  { id: 'barclays', name: 'Barclays', colour: '#00AEEF', letter: 'B', domain: 'barclays.co.uk', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Memo', debit: 'Amount', credit: 'Amount', balance: 'Balance' }, pdfHint: 'Export from Barclays Online Banking → Statements → Download' },
  { id: 'hsbc', name: 'HSBC', colour: '#DB0011', letter: 'H', domain: 'hsbc.co.uk', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Description', amount: 'Amount', balance: 'Balance' }, pdfHint: 'Export from HSBC Online Banking → My Accounts → Statements' },
  { id: 'natwest', name: 'NatWest', colour: '#4A0E8F', letter: 'N', domain: 'natwest.com', statementFormats: ['pdf', 'csv', 'ofx'], csvColumns: { date: 'Date', description: 'Description', debit: 'Debit Amount', credit: 'Credit Amount', balance: 'Balance' } },
  { id: 'lloyds', name: 'Lloyds Bank', colour: '#006A4D', letter: 'L', domain: 'lloydsbank.com', statementFormats: ['pdf', 'csv'] },
  { id: 'santander', name: 'Santander', colour: '#EC0000', letter: 'S', domain: 'santander.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'monzo', name: 'Monzo', colour: '#FF3464', letter: 'M', domain: 'monzo.com', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Name', amount: 'Amount', balance: 'Balance' }, pdfHint: 'Monzo app → Account → Export transactions' },
  { id: 'starling', name: 'Starling Bank', colour: '#6935D3', letter: 'S', domain: 'starlingbank.com', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Counter Party', amount: 'Amount (GBP)' }, pdfHint: 'Starling app → Statements → Download CSV' },
  { id: 'chase_uk', name: 'Chase UK', colour: '#117ACA', letter: 'C', domain: 'chase.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'halifax', name: 'Halifax', colour: '#005EB8', letter: 'H', domain: 'halifax.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'nationwide', name: 'Nationwide', colour: '#10069F', letter: 'N', domain: 'nationwide.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'tsb', name: 'TSB', colour: '#007DB6', letter: 'T', domain: 'tsb.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'first_direct', name: 'First Direct', colour: '#000000', letter: 'FD', domain: 'firstdirect.com', statementFormats: ['pdf', 'csv'] },
  { id: 'metro', name: 'Metro Bank', colour: '#D40511', letter: 'M', domain: 'metrobankonline.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'virgin_money', name: 'Virgin Money', colour: '#E10A0A', letter: 'V', domain: 'virginmoney.com', statementFormats: ['pdf', 'csv'] },
  { id: 'revolut', name: 'Revolut', colour: '#0075EB', letter: 'R', domain: 'revolut.com', statementFormats: ['pdf', 'csv', 'xlsx'] },
  { id: 'wise', name: 'Wise', colour: '#00B9A7', letter: 'W', domain: 'wise.com', statementFormats: ['pdf', 'csv'] },
  { id: 'amex', name: 'American Express', colour: '#007BC1', letter: 'A', domain: 'americanexpress.com', statementFormats: ['pdf', 'csv', 'ofx'] },
  { id: 'barclaycard', name: 'Barclaycard', colour: '#00AEEF', letter: 'BC', domain: 'barclaycard.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'vanquis', name: 'Vanquis', colour: '#8B1A8B', letter: 'V', domain: 'vanquis.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'vanguard', name: 'Vanguard', colour: '#961A1A', letter: 'V', domain: 'vanguardinvestor.co.uk', statementFormats: ['pdf', 'csv', 'xlsx'] },
  { id: 'hargreaves', name: 'Hargreaves Lansdown', colour: '#00539F', letter: 'HL', domain: 'hl.co.uk', statementFormats: ['pdf', 'csv'] },
  { id: 'isa', name: 'Stocks & Shares ISA', colour: '#1D9E75', letter: 'ISA', statementFormats: ['pdf', 'csv'] },
  { id: 'coinbase', name: 'Coinbase', colour: '#0052FF', letter: 'C', domain: 'coinbase.com', statementFormats: ['pdf', 'csv'] },
  { id: 'binance', name: 'Binance', colour: '#F3BA2F', letter: 'B', domain: 'binance.com', statementFormats: ['csv'] },
  { id: 'other', name: 'Other / Not listed', colour: '#7F77DD', letter: '?', statementFormats: ['pdf', 'csv', 'xlsx'] },
];

export const getBankById = (id: string) => UK_BANKS.find(b => b.id === id);

export function bankLogoUrl(domain?: string | null) {
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

export function findBankByInstitution(institution?: string | null): BankData | undefined {
  if (!institution) return undefined;
  const norm = institution.trim().toLowerCase();
  return UK_BANKS.find(b => {
    const n = b.name.toLowerCase();
    return n === norm || norm.includes(n) || n.includes(norm);
  });
}
