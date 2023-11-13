export default async (model, condition, updateData) => {
    const [updatedCount] = await model.update(updateData, { where: condition });
    return updatedCount;
}