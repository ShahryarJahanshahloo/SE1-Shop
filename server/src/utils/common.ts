export async function updateByValidKeys(
  doc: any,
  updates: any,
  validUpdates: any
) {
  const updateKeys = Object.keys(updates)
  const isValidOperation = updateKeys.every(updateKey =>
    validUpdates.includes(updateKey)
  )
  if (!isValidOperation) throw new Error('invalid update operation')
  updateKeys.forEach(updateKey => (doc[updateKey] = updates[updateKey]))
  await doc.save()
}
