import path from 'path'
import fs from 'fs'
import { FileSystem } from 'mel-core'

export default class NodeFileSystem extends FileSystem {
  constructor () {
    super()
    this._APPLICATION_DIRECTORY = path.dirname(process.mainModule.filename)
  }

  get APPLICATION_DIRECTORY () {
    return this._APPLICATION_DIRECTORY
  }

  readFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(filePath),
        { encoding: 'utf-8' },
        (err, data) => {
          if (err) {
            resolve(null)
            return
          }
          resolve(data)
        }
      )
    })
  }

  readFileBuffer (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(filePath), (err, buffer) => {
        if (err) {
          reject(err)
          return
        }
        resolve(buffer.buffer)
      })
    })
  }

  async readDir (dirPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) {
          reject(err)
        }
        resolve(files)
      })
    })
  }

  async makeDirectory (directoryPath) {
    let directory = directoryPath.split('/')
    directory.pop()
    let parentDirectoryPath = directory.join('/')
    if (!await this.stats(parentDirectoryPath)) {
      await this.makeDirectory(parentDirectoryPath)
    }
    return new Promise((resolve, reject) => {
      fs.mkdir(directoryPath, error => {
        if (error) {
          reject(error)
        }
        resolve()
      })
    })
  }

  writeFile (filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async writeBinaryFile (filePath, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, { encoding: 'binary' }, err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  stats (path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(null)
          return
        }

        resolve({
          isDirectory: stats.isDirectory(),
          lastModified: stats.mtime.getTime()
        })
      })
    })
  }
}
