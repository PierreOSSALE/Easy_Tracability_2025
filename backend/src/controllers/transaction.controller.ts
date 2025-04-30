//EASY-TRACABILITY: backend/src/controllers/transaction.controller.ts

import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { Parser } from "json2csv";
import { Op } from "sequelize";
import PDFDocument from "pdfkit";

const transactionService = new TransactionService();

export class TransactionController {
  static async createTransaction(req: Request, res: Response) {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  }

  static async getAllTransactions(req: Request, res: Response) {
    const { type, minPrice, maxPrice, limit = 10, offset = 0 } = req.query;

    const filters: any = {};

    if (type) filters.transactionType = type;
    if (minPrice || maxPrice) {
      filters.totalPrice = {};
      if (minPrice) filters.totalPrice[Op.gte] = parseFloat(minPrice as string);
      if (maxPrice) filters.totalPrice[Op.lte] = parseFloat(maxPrice as string);
    }

    const transactions = await transactionService.getAllTransactions(
      filters,
      Number(limit),
      Number(offset)
    );
    res.status(200).json(transactions);
  }

  static async getTransactionById(req: Request, res: Response) {
    const transaction = await transactionService.getTransactionById(
      req.params.uuid
    );
    if (!transaction) {
      res.status(404).json({ message: "Transaction non trouvée" });
      return;
    }
    res.status(200).json(transaction);
  }

  static async updateTransaction(req: Request, res: Response) {
    const transaction = await transactionService.updateTransaction(
      req.params.uuid,
      req.body
    );
    res.status(200).json(transaction);
  }

  static async deleteTransaction(req: Request, res: Response) {
    const result = await transactionService.deleteTransaction(req.params.uuid);
    res.status(200).json(result);
  }

  static async exportTransactionsCSV(req: Request, res: Response) {
    const { type } = req.query;

    const filters: any = {};
    if (type) filters.transactionType = type;

    const transactionsData = await transactionService.getAllTransactions(
      filters,
      1000,
      0
    );
    const jsonTransactions = transactionsData.rows.map((t) => t.toJSON());

    const parser = new Parser();
    const csv = parser.parse(jsonTransactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    res.send(csv);
  }

  static async generateInvoice(req: Request, res: Response) {
    const uuid = req.params.uuid;
    const transaction = await transactionService.getTransactionById(uuid);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction non trouvée" });
    }

    const doc = new PDFDocument();
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=facture-${uuid}.pdf`
      );
      res.send(result);
    });

    doc.fontSize(20).text("Facture / Bon de sortie", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`UUID: ${transaction.uuid}`);
    doc.text(`Type de transaction: ${transaction.transactionType}`);
    doc.text(`Montant total: ${transaction.totalPrice} €`);
    doc.text(`Date: ${transaction.createdAt}`);
    doc.end();
  }
}
