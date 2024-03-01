import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Decimal } from "decimal.js";

@Entity({ tableName: "currencies" })
export default class Currency {
  @PrimaryKey()
  id!: number;

  @Property({ columnType: "VARCHAR(32)", nullable: false, index: true })
  name!: string;

  @Property({ nullable: false, default: "now()" })
  createdAt!: Date;

  @Property({
    nullable: false,
    columnType: "NUMERIC(16,2)",
    type: () => Decimal,
  })
  value!: string | Decimal;
}
