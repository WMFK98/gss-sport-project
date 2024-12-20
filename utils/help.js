export function formatDate(date) {
  return date?.toDate().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function deleteField(obj, nameField) {
  const temp = { ...obj };
  if (temp.hasOwnProperty(nameField)) delete temp[nameField];
  return temp;
}
