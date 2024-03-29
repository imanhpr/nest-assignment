import { InjectRepository } from "@mikro-orm/nestjs";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import Transaction from "../models/transaction.model.js";
import {
  EntityRepository,
  PostgreSqlDriver,
  SqlEntityManager,
} from "@mikro-orm/postgresql";
import User from "../models/User.model.js";
import { EntityManager, LockMode } from "@mikro-orm/core";
import { Decimal } from "decimal.js";
import Currency from "../models/currency.model.js";

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: EntityRepository<Transaction>,
    private readonly em: EntityManager<PostgreSqlDriver>
  ) {}

  async transactionList(userId: number) {
    const lst = this.transactionRepo.find(
      { user: userId },
      {
        limit: 10,
        orderBy: [{ id: "DESC" }],
        populate: ["user"],
        fields: ["user.id", "user.email", "id", "amount", "createdAt"],
      }
    );
    return lst;
  }
  async walletInfo(user: Omit<User, "password">) {
    if (!(this.em instanceof SqlEntityManager))
      throw new InternalServerErrorException();
    const priceList = await this.em
      .qb(Currency, "c")
      .select(["name", "id", "value", "createdAt"])
      .distinctOn("name")
      .orderBy({ name: "DESC", id: "desc", createdAt: "DESC" });
    const convertedPriceList = priceList.map((cur) => {
      if (typeof cur.value === "string") {
        const decimalValue = new Decimal(cur.value);
        return {
          name: cur.name,
          balance: decimalValue.mul(user.current_balance),
        };
      }
      return { name: cur.name, balance: cur.value.mul(user.current_balance) };
    });

    return {
      id: user.id,
      email: user.email,
      current_base_balance: user.current_balance,
      base_currency: "USD",
      converted_currency: "TOMAN",
      converted_list: convertedPriceList,
    };
  }
  async createNewTransaction(userId: number, balance: Decimal) {
    return await this.em.transactional(async (em) => {
      const user = await em.findOne(
        User,
        { id: userId },
        { lockMode: LockMode.PESSIMISTIC_WRITE, exclude: ["password"] }
      );
      if (user === null) throw new NotFoundException();
      const transaction = em.create(
        Transaction,
        {
          amount: balance,
          user: user,
        },
        { partial: true, persist: true }
      );
      const { total } = await em
        .createQueryBuilder(Transaction, "t")
        .getKnex()
        .sum("amount as total")
        .where({ user_id: userId })
        .first<{ total: string | null }>();
      em.persist(user);
      if (total === null) {
        user.current_balance = transaction.amount;
      } else {
        user.current_balance = new Decimal(total).add(transaction.amount);
      }
      await em.flush();
      return {
        id: user.id,
        email: user.email,
        balance: user.current_balance.toFixed(2),
      };
    });
  }
}
