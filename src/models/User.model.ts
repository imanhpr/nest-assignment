import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import Transaction from "./transaction.model.js";
import { Decimal } from "decimal.js";

@Entity({ tableName: "users" })
export default class User {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: "email", nullable: false, unique: true })
  email!: string;

  @Property({ fieldName: "password", nullable: false })
  password!: string;

  @OneToMany(() => Transaction, (o) => o.user)
  transactions = new Collection<Transaction>(this);

  @Property({
    nullable: false,
    columnType: "NUMERIC(6,2)",
    type: () => Decimal,
  })
  currentBalance: Decimal = new Decimal(0);
}
