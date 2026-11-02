const { pool, ready, sql } = require('../db')
const HttpError = require('../utils/httpError')

// Sections editable from the admin dashboard. Keys starting with "_" are private (e.g. the admin credentials).
const EDITABLE = ['site', 'seo', 'hero', 'nav', 'sections', 'pillars', 'stats', 'services', 'why', 'tech', 'process', 'projects', 'testimonials', 'faq']
const parse = v => (typeof v === 'string' ? JSON.parse(v) : v)

exports.getPublic = async () => {
  await ready
  const { recordset } = await pool.request().query("SELECT k, v FROM content WHERE k NOT LIKE '[_]%'")
  return Object.fromEntries(recordset.map(r => [r.k, parse(r.v)]))
}
exports.get = async key => {
  await ready
  const { recordset } = await pool.request().input('k', sql.VarChar(50), key).query('SELECT v FROM content WHERE k = @k')
  return recordset[0] ? parse(recordset[0].v) : null
}
exports.set = async (key, value) => {
  await ready
  await pool.request().input('k', sql.VarChar(50), key).input('v', sql.NVarChar(sql.MAX), JSON.stringify(value)).query(`
    MERGE content AS target USING (SELECT @k AS k, @v AS v) AS src ON target.k = src.k
    WHEN MATCHED THEN UPDATE SET v = src.v, updated_at = SYSUTCDATETIME()
    WHEN NOT MATCHED THEN INSERT (k, v) VALUES (src.k, src.v);
  `)
}
exports.insertIfMissing = async (key, value) => {
  await ready
  await pool.request().input('k', sql.VarChar(50), key).input('v', sql.NVarChar(sql.MAX), JSON.stringify(value)).query(
    'IF NOT EXISTS (SELECT 1 FROM content WHERE k = @k) INSERT INTO content (k, v) VALUES (@k, @v)'
  )
}
exports.saveEditable = async (key, value) => {
  if (!EDITABLE.includes(key)) throw new HttpError(400, 'Invalid section')
  await exports.set(key, value)
}
