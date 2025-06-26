export const getFirstVolunteerTimes = (
  vTimes: any,
): { joinedAt?: number; arrivedAt?: number } => {
  if (!vTimes || typeof vTimes !== 'object') return {};
  let earliest: { joinedAt?: number; arrivedAt?: number } = {};

  Object.values(vTimes as Record<string, any>).forEach((rec: any) => {
    if (
      rec?.joinedAt !== undefined &&
      (earliest.joinedAt === undefined || rec.joinedAt < earliest.joinedAt)
    ) {
      earliest = { joinedAt: rec.joinedAt, arrivedAt: rec.arrivedAt };
    }
  });
  return earliest;
};
