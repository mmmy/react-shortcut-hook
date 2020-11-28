import { OsShortcuts } from './types'

type OS = 'Windows' | 'Macintosh' | 'Unknown OS'

export function getOS(): OS {
  let OSName: OS = 'Unknown OS'

  if (navigator.userAgent.indexOf('Win') !== -1) OSName = 'Windows'
  if (navigator.userAgent.indexOf('Mac') !== -1) OSName = 'Macintosh'
  if (navigator.userAgent.indexOf('Linux') !== -1) OSName = 'Windows'

  return OSName
}

export function getShortcut(shortcuts: string[] | OsShortcuts): string[] {
  if ((shortcuts as OsShortcuts).windows !== undefined) {
    const osShortcuts = shortcuts as OsShortcuts
    return getOS() === 'Macintosh' ? osShortcuts.macOS : osShortcuts.windows
  }
  return shortcuts as string[]
}

export function matchCommand(e: KeyboardEvent, command: string[]) {
  let matched = false

  for (let i = 0; i < command.length; i++) {
    const key = command[i]
    if (key === 'meta') {
      if (e.metaKey) matched = true
      else return false
    } else if (key === 'ctrl') {
      if (e.ctrlKey) matched = true
      else return false
    } else if (key === 'alt') {
      if (e.altKey) matched = true
      else return false
    } else if (key === 'shift') {
      if (e.shiftKey) matched = true
      else return false
    } else if (key === 'space') {
      if (e.key === ' ') matched = true
      else return false
    } else if (key === e.key.toLowerCase()) matched = true
    else return false
  }

  return matched
}
