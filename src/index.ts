import { useEffect, MutableRefObject, useState, useCallback, useRef } from 'react'
import { Command, Option, UpdateCommand, OsShortcuts, ButtonCommanderReturnType } from './types'
import { matchCommand, getShortcut } from './utils'

export interface ShortcutCommand extends Command {}
export interface ShortcutOsShortcuts extends OsShortcuts {}

export const useShortcut = (
  ref?: MutableRefObject<any>,
  commands?: Command[],
  option?: Option,
): ButtonCommanderReturnType => {
  const [command, setCommand] = useState<Command>()
  const commandSetRef = useRef(new Map<string, Command>())
  const commandChangeFuncRef = useRef(new Set<any>())
  const longPressRef = useRef(false)
  const dontRepeatRef = useRef(false)
  const globalListenerRegisteredRef = useRef(false)
  const longPressFuncRef = useRef(0)
  const removeTimeoutRef = useRef(0)

  useEffect(() => {
    commandChangeFuncRef.current.add(setCommand)

    if (commands) {
      for (let i = 0; i < commands.length; i++) {
        const com = commands[i]
        commandSetRef.current.set(com.name, {
          global: !ref?.current,
          registerTime: new Date(),
          scopedTo: ['INPUT', 'TEXTAREA', 'SELECT'].includes(ref?.current?.tagName)
            ? ref?.current?.tagName
            : undefined,
          readOnly: false,
          ...com,
          ...option,
        })
      }
    }

    function callbackFunc(e: KeyboardEvent, value: Command) {
      if (!value.scopedTo || (e.target as HTMLElement).tagName === value.scopedTo) {
        clearTimeout(removeTimeoutRef.current)

        for (let i = 0; i < Array.from(commandChangeFuncRef.current.values()).length; i++) {
          const setCommand1 = Array.from(commandChangeFuncRef.current.values())[i]
          setCommand1(value)

          removeTimeoutRef.current = window.setTimeout(
            () => setCommand1(undefined),
            value.delay ?? 1000,
          )
        }

        value.callback(e)
      }

      if (value.once) {
        commandSetRef.current.delete(value.name)
      }
    }

    const keyDownListener = (e: KeyboardEvent) => {
      // Sorts the command set by global property false -> true
      const sortedCommands = Array.from(commandSetRef.current.values()).sort((x, y) =>
        (x === y ? 0 : x) ? -1 : 1,
      )

      for (let i = 0; i < sortedCommands.length; i++) {
        const value = sortedCommands[i]
        if (matchCommand(e, getShortcut(value.shortcut)) && !value.stopped) {
          if (value.longPress) {
            if (!longPressRef.current) {
              longPressRef.current = true

              longPressFuncRef.current = window.setTimeout(
                () => callbackFunc(e, value),
                value.longPressWaitTime ?? 500,
              )
            }
          } else if (value.dontRepeat) {
            if (!dontRepeatRef.current) {
              dontRepeatRef.current = true

              callbackFunc(e, value)
            }
          } else {
            callbackFunc(e, value)
          }

          // If the stopBubbling is true don't execute if another command with
          // the same short is registered.
          if (value.stopBubblingUp) {
            e.preventDefault()
            e.stopPropagation()
            break
          }
        }
      }

      return false
    }

    const keyUpListener = () => {
      longPressRef.current = false
      dontRepeatRef.current = false
      clearTimeout(longPressFuncRef.current)
    }

    /**
     * Registers listener on the ref provided.
     *
     * If no ref is provided check to see if any global listener was
     * set and then only set it.
     */
    if (ref && ref.current) {
      ref.current.addEventListener('keydown', keyDownListener)
      ref.current.addEventListener('keyup', keyUpListener)
    } else if (!globalListenerRegisteredRef.current) {
      globalListenerRegisteredRef.current = true
      document.body.addEventListener('keydown', keyDownListener)
      document.body.addEventListener('keyup', keyUpListener)
    }

    return () => {
      // When the hook unmounts first remove the commands from the list.
      if (commands) {
        for (let i = 0; i < Array.from(commands.values()).length; i++) {
          const com = Array.from(commands.values())[i]
          commandSetRef.current.delete(com.name)
        }
      }

      commandChangeFuncRef.current.delete(setCommand)

      // If the ref was provided remove listener too.
      // If the commandSet down to 0 remove teh global listener too.
      if (ref && ref.current) {
        ref.current.removeEventListener('keydown', keyDownListener)
        ref.current.removeEventListener('keyup', keyUpListener)
      } else if (globalListenerRegisteredRef.current && commandSetRef.current.size === 0) {
        globalListenerRegisteredRef.current = false
        document.body.removeEventListener('keydown', keyDownListener)
        document.body.removeEventListener('keyup', keyUpListener)
      }
    }
  }, [ref && ref.current, commands, ])

  const getAll = useCallback(() => Array.from(commandSetRef.current.values()), [])

  const stop = useCallback((name: string) => {
    const commandData = commandSetRef.current.get(name)
    if (commandData) {
      commandSetRef.current.set(name, { ...commandData, stopped: true })
    }
  }, [])

  const start = useCallback((name: string) => {
    const commandData = commandSetRef.current.get(name)
    if (commandData) {
      commandSetRef.current.set(name, { ...commandData, stopped: false })
    }
  }, [])

  const update = useCallback((name: string, options: UpdateCommand) => {
    const com = commandSetRef.current.get(name)
    if (com) {
      if (!com.readOnly) {
        commandSetRef.current.set(name, { ...com, ...options })
      } else {
        throw Error('Shortcut you are trying to modify is set to readOnly.')
      }
    } else {
      throw Error('Shortcut that you are trying to update does not exist.')
    }
  }, [])

  const remove = useCallback((name: string) => commandSetRef.current.delete(name), [])

  const clearAll = () => commandSetRef.current.clear()

  const add = useCallback((com: Command) => {
    if (!commandSetRef.current.has(com.name)) {
      commandSetRef.current.set(com.name, com)
    } else {
      throw new Error('Shortcut with the same name already exist.')
    }
  }, [])

  const once = useCallback((com: Command) => {
    commandSetRef.current.set(com.name, { ...com, once: true })
  }, [])

  const longPress = useCallback((com: Command) => {
    commandSetRef.current.set(com.name, { ...com, longPress: true })
  }, [])

  return {
    getAll,
    stop,
    start,
    update,
    remove,
    clearAll,
    add,
    command,
    once,
    longPress,
  }
}

export default useShortcut
