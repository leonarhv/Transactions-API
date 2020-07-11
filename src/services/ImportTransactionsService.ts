import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  fileName: string;
}

async function loadCSV(fileName: string): Promise<string[]> {
  const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);
  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: string[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const data = await loadCSV(fileName);
    console.log(data);

    const transactions: Transaction[] = [];

    return transactions;
  }
}

export default ImportTransactionsService;
