function clean(value, max = 500) {
  return String(value || "").trim().slice(0, max);
}

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(d.getTime()) && d >= today;
}

module.exports = { clean, isValidDate };
