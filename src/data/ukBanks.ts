export interface BankData {
  id: string;
  name: string;
  colour: string;
  letter: string;
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
  { id: 'barclays', name: 'Barclays', colour: '#00AEEF', letter: 'B', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Memo', debit: 'Amount', credit: 'Amount', balance: 'Balance' }, pdfHint: 'Export from Barclays Online Banking → Statements → Download' },
  { id: 'hsbc', name: 'HSBC', colour: '#DB0011', letter: 'H', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Description', amount: 'Amount', balance: 'Balance' }, pdfHint: 'Export from HSBC Online Banking → My Accounts → Statements' },
  { id: 'natwest', name: 'NatWest', colour: '#4A0E8F', letter: 'N', statementFormats: ['pdf', 'csv', 'ofx'], csvColumns: { date: 'Date', description: 'Description', debit: 'Debit Amount', credit: 'Credit Amount', balance: 'Balance' } },
  { id: 'lloyds', name: 'Lloyds Bank', colour: '#006A4D', letter: 'L', statementFormats: ['pdf', 'csv'] },
  { id: 'santander', name: 'Santander', colour: '#EC0000', letter: 'S', statementFormats: ['pdf', 'csv'] },
  { id: 'monzo', name: 'Monzo', colour: '#FF3464', letter: 'M', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Name', amount: 'Amount', balance: 'Balance' }, pdfHint: 'Monzo app → Account → Export transactions' },
  { id: 'starling', name: 'Starling Bank', colour: '#6935D3', letter: 'S', statementFormats: ['pdf', 'csv'], csvColumns: { date: 'Date', description: 'Counter Party', amount: 'Amount (GBP)' }, pdfHint: 'Starling app → Statements → Download CSV' },
  { id: 'chase_uk', name: 'Chase UK', colour: '#117ACA', letter: 'C', statementFormats: ['pdf', 'csv'] },
  { id: 'halifax', name: 'Halifax', colour: '#005EB8', letter: 'H', statementFormats: ['pdf', 'csv'] },
  { id: 'nationwide', name: 'Nationwide', colour: '#10069F', letter: 'N', statementFormats: ['pdf', 'csv'] },
  { id: 'tsb', name: 'TSB', colour: '#007DB6', letter: 'T', statementFormats: ['pdf', 'csv'] },
  { id: 'first_direct', name: 'First Direct', colour: '#000000', letter: 'FD', statementFormats: ['pdf', 'csv'] },
  { id: 'metro', name: 'Metro Bank', colour: '#D40511', letter: 'M', statementFormats: ['pdf', 'csv'] },
  { id: 'virgin_money', name: 'Virgin Money', colour: '#E10A0A', letter: 'V', statementFormats: ['pdf', 'csv'] },
  { id: 'revolut', name: 'Revolut', colour: '#0075EB', letter: 'R', statementFormats: ['pdf', 'csv', 'xlsx'] },
  { id: 'wise', name: 'Wise', colour: '#00B9A7', letter: 'W', statementFormats: ['pdf', 'csv'] },
  { id: 'amex', name: 'American Express', colour: '#007BC1', letter: 'A', statementFormats: ['pdf', 'csv', 'ofx'] },
  { id: 'barclaycard', name: 'Barclaycard', colour: '#00AEEF', letter: 'BC', statementFormats: ['pdf', 'csv'] },
  { id: 'vanquis', name: 'Vanquis', colour: '#8B1A8B', letter: 'V', statementFormats: ['pdf', 'csv'] },
  { id: 'vanguard', name: 'Vanguard', colour: '#961A1A', letter: 'V', statementFormats: ['pdf', 'csv', 'xlsx'] },
  { id: 'hargreaves', name: 'Hargreaves Lansdown', colour: '#00539F', letter: 'HL', statementFormats: ['pdf', 'csv'] },
  { id: 'isa', name: 'Stocks & Shares ISA', colour: '#1D9E75', letter: 'ISA', statementFormats: ['pdf', 'csv'] },
  { id: 'coinbase', name: 'Coinbase', colour: '#0052FF', letter: 'C', statementFormats: ['pdf', 'csv'] },
  { id: 'binance', name: 'Binance', colour: '#F3BA2F', letter: 'B', statementFormats: ['csv'] },
  { id: 'other', name: 'Other / Not listed', colour: '#7F77DD', letter: '?', statementFormats: ['pdf', 'csv', 'xlsx'] },
];

export const getBankById = (id: string) => UK_BANKS.find(b => b.id === id);
