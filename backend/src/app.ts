import express from 'express'
import cors from 'cors'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const here = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(here, '../data')

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'] }))
app.use(express.json())

async function readJson<T>(filename: string): Promise<T> {
  const raw = await readFile(path.join(dataDir, filename), 'utf8')
  return JSON.parse(raw) as T
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'estate-intelligence-api' }))

app.get('/api/developers', async (_req, res, next) => {
  try { res.json(await readJson('developers.json')) } catch (error) { next(error) }
})

app.get('/api/projects', async (_req, res, next) => {
  try {
    const developers = await readJson<{ id: string; projects: { id: string; name: string }[] }[]>('developers.json')
    const projectDetails = await readJson<Record<string, unknown>>('projects.json').catch(() => ({}))
    res.json(developers.flatMap(d => d.projects.map(p => ({ ...projectDetails[p.id] as object, id: p.id, name: p.name, developerId: d.id }))))
  } catch (error) { next(error) }
})

app.get('/api/projects/:id', async (req, res, next) => {
  try {
    const developers = await readJson<{ id: string; projects: { id: string; name: string }[] }[]>('developers.json')
    const projectDetails = await readJson<Record<string, Record<string, unknown>>>('projects.json').catch(() => ({}))
    const project = developers.flatMap(d => d.projects.map(p => ({ ...projectDetails[p.id], id: p.id, name: p.name, developerId: d.id }))).find(p => p.id === req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    return res.json(project)
  } catch (error) { return next(error) }
})

app.get('/api/projects/:id/prices', async (req, res, next) => {
  try {
    const history = await readJson<Record<string, unknown[]>>('price-history.json')
    return res.json(history[req.params.id] ?? [])
  } catch (error) { return next(error) }
})

app.get('/api/compare', async (req, res, next) => {
  try {
    const ids = String(req.query.ids ?? '').split(',').filter(Boolean).slice(0, 4)
    const developers = await readJson<{ id: string; projects: { id: string; name: string }[] }[]>('developers.json')
    const details = await readJson<Record<string, Record<string, unknown>>>('projects.json').catch(() => ({}))
    const all = developers.flatMap(d => d.projects.map(p => ({ ...details[p.id], id: p.id, name: p.name, developerId: d.id })))
    return res.json(all.filter(p => ids.includes(p.id)))
  } catch (error) { return next(error) }
})

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => console.log(`Estate Intelligence API listening on http://localhost:${port}`))