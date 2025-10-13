import { createdModels } from "../model/db";
import { Op } from "sequelize";
import { decodeQuery } from "../utils/queryBuilder";

export const buildSequelizeOptions = (q?: string) => {
  if (!q) return {};

  const { filters, search, limit = 100, offset = 0, order, include } = decodeQuery(q);

  const where: Record<string, any> = { ...filters };

  if (search) {
    for (const key in search) {
      where[key] = { [Op.like]: `%${search[key]}%` };
    }
  }

  // ✅ Map includes properly
  const mappedInclude = (include || []).map((inc: any) => ({
    ...inc,
    model:
      typeof inc.model === "string" && createdModels[inc.model]
        ? createdModels[inc.model]
        : inc.model,
  }));

  return {
    where,
    limit,
    offset,
    order: order ?? [["createdAt", "DESC"]],
    include: mappedInclude,
  };
};
