
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

// Hardcoded Regions from regiones.ts
const REGIONS = [
    "Pacífico y Atlántico",
    "Caribe",
    "Santanderes",
    "Andina",
    "Pacífico Sur",
    "Orinoquía",
    "Amazónica",
    "Bogotá"
]

function getFiles(dir: string, files: string[] = []) {
    const fileList = fs.readdirSync(dir)
    for (const file of fileList) {
        const name = path.join(dir, file)
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files)
        } else {
            if (file.endsWith('.ts') && !file.includes('index.ts') && !file.includes('regiones.ts')) {
                files.push(name)
            }
        }
    }
    return files
}

export async function GET() {
    try {
        const dataSamplePath = path.join(process.cwd(), 'data_sample/regions')
        const files = getFiles(dataSamplePath)

        const subRegions = new Set<string>()
        const zonas = new Set<string>()

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8')

            // Extract SubRegion Name (Top level name)
            // Matches: export const ... = { ... name: "Name"
            const subRegionMatch = content.match(/name:\s*"([^"]+)"/)
            if (subRegionMatch) {
                // Verify it is top level (heuristic) - usually the first 'name' found in the file is the subregion name 
                // because 'zonas' comes later.
                // BUT wait, checking 'antioquia.ts', line 4 is 'name: "Antioquia"'. 
                // So the first name property is safe.
                subRegions.add(subRegionMatch[1])
            }

            // Extract Zonas
            const zonasSplit = content.split('zonas:[')
            if (zonasSplit.length > 1) {
                const zonasBlock = zonasSplit[1]
                // Regex for Zona names - looking for specific indentation or just assume names in this block are candidates
                // In antioquia.ts, zona name has indentation of 8 spaces: '        name: "Medellín y Valle de Aburrá",'
                // Munipicio has 12 spaces: '            name: "Medellín",'

                // Let's capture matches with 6 to 10 spaces indentation
                const zonaMatches = zonasBlock.matchAll(/^\s{6,10}name:\s*"([^"]+)"/gm)
                for (const match of zonaMatches) {
                    zonas.add(match[1])
                }
            }
        })

        const regionsList = Array.from(REGIONS).sort()
        const subRegionsList = Array.from(subRegions).sort()
        const zonasList = Array.from(zonas).sort()

        // Update DB
        const contentType = await prisma.contentType.findFirst({
            where: { apiIdentifier: 'seoBlog' },
            include: { fields: true }
        })

        if (!contentType) {
            return NextResponse.json({ error: 'Content Type Not Found' }, { status: 404 })
        }

        const updates = []

        // Update Region Name
        const regionField = contentType.fields.find(f => f.apiIdentifier === 'regionName')
        if (regionField) {
            updates.push(prisma.field.update({
                where: { id: regionField.id },
                data: {
                    metadata: {
                        ...((regionField.metadata as object) || {}),
                        options: regionsList
                    }
                }
            }))
        }

        // Update SubRegion Name
        const subRegionField = contentType.fields.find(f => f.apiIdentifier === 'subRegionName')
        if (subRegionField) {
            updates.push(prisma.field.update({
                where: { id: subRegionField.id },
                data: {
                    metadata: {
                        ...((subRegionField.metadata as object) || {}),
                        options: subRegionsList
                    }
                }
            }))
        }

        // Update Zona Name
        const zonaField = contentType.fields.find(f => f.apiIdentifier === 'zonaName')
        if (zonaField) {
            updates.push(prisma.field.update({
                where: { id: zonaField.id },
                data: {
                    metadata: {
                        ...((zonaField.metadata as object) || {}),
                        options: zonasList
                    }
                }
            }))
        }

        await Promise.all(updates)

        return NextResponse.json({
            success: true,
            stats: {
                regions: regionsList.length,
                subRegions: subRegionsList.length,
                zonas: zonasList.length
            },
            data: {
                regions: regionsList,
                subRegions: subRegionsList,
                zonas: zonasList
            }
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
