import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  sql,
} from "@mikro-orm/core";
import User from "./User.model.js";
import { Decimal } from "decimal.js";

@Entity({ tableName: "transactions" })
export default class Transaction {
  @PrimaryKey()
  id!: number;

  @Property({
    columnType: "NUMERIC(6,2)",
    fieldName: "amount",
    nullable: false,
    type: () => Decimal,
  })
  amount!: Decimal;

  @Property({ nullable: false, default: sql.now() })
  createdAt!: Date;

  @ManyToOne(() => User, { ref: true })
  user!: Ref<User>;
}
