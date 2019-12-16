import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)
const layerRegex = /^\d*: (.*) \(.*\)$/

export default async (path) => {
  const { stdout='' } = await execAsync(`ogrinfo "${path}" -ro -so -q`)
  return stdout
    .trim().split('\n')
    .map((line) => line.match(layerRegex)?.[1])
    .filter((i) => !!i)
}
