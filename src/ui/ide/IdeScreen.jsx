import { useEffect, useRef, useState } from 'react'
import { useStore } from '../../state/useStore'
import { ideFiles, folders, fileById, DEFAULT_FILE_ID } from './files.jsx'

const BOOT_LINES = [
  'vivek-os 2.7.27 (riscv64) — booting…',
  '[ OK ] cpu0: online @ 3.78 GPa',
  '[ OK ] mounted /dev/experience (ktfs, journaled)',
  '[ OK ] mounted /dev/projects (ktfs, journaled)',
  '[ OK ] networkd: linkedin.com reachable',
  '[ OK ] loaded 7 files, 0 regrets',
  'starting display manager…',
]

/**
 * Monitor A: the experience "IDE". On first zoom-in it boots (kernel lines →
 * flicker → editor); afterwards it's instant. Files in the tree open as tabs of
 * commented code; the terminal "runs" the active file and prints its one-line
 * summary. Default export for React.lazy.
 */
export default function IdeScreen({ interactive = true }) {
  const active = useStore((s) => s.currentView === 'monitor1')
  const booted = useStore((s) => s.ideBooted)
  // The boot sequence only plays in the interactive overlay instance; the
  // decorative in-world copy just shows the editor.
  const showBoot = interactive && active && !booted
  return (
    <div className="ide">
      {showBoot ? <BootSequence /> : <Ide />}
    </div>
  )
}

function BootSequence() {
  const setIdeBooted = useStore((s) => s.setIdeBooted)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= BOOT_LINES.length) {
          clearInterval(id)
          // brief pause on the full screen, then flicker into the IDE
          setTimeout(() => setIdeBooted(), 420)
          return n
        }
        return n + 1
      })
    }, 230)
    return () => clearInterval(id)
  }, [setIdeBooted])

  return (
    <div className="ide-boot">
      {BOOT_LINES.slice(0, shown).map((l, i) => (
        <div key={i} className={'boot-line' + (l.startsWith('[ OK ]') ? ' is-ok' : '')}>
          {l}
        </div>
      ))}
      <span className="boot-cursor" />
    </div>
  )
}

function Ide() {
  const [openIds, setOpenIds] = useState([DEFAULT_FILE_ID])
  const [activeId, setActiveId] = useState(DEFAULT_FILE_ID)
  const [history, setHistory] = useState([])
  const [running, setRunning] = useState(false)
  const termRef = useRef(null)
  const file = fileById(activeId)

  const open = (id) => {
    setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id]))
    setActiveId(id)
  }

  const close = (id, e) => {
    e.stopPropagation()
    setOpenIds((ids) => {
      const next = ids.filter((x) => x !== id)
      if (id === activeId && next.length) setActiveId(next[next.length - 1])
      return next.length ? next : [DEFAULT_FILE_ID]
    })
  }

  const run = () => {
    if (running || !file) return
    setRunning(true)
    setHistory((h) => [...h, { cmd: file.run.cmd, out: null }])
    setTimeout(() => {
      setHistory((h) => {
        const next = h.slice()
        next[next.length - 1] = { cmd: file.run.cmd, out: file.run.out }
        return next
      })
      setRunning(false)
    }, 650)
  }

  useEffect(() => {
    termRef.current?.scrollTo(0, termRef.current.scrollHeight)
  }, [history])

  return (
    <div className="ide-window ide-flicker-in">
      <div className="ide-titlebar">
        <span className="ide-dot ide-dot-r" />
        <span className="ide-dot ide-dot-y" />
        <span className="ide-dot ide-dot-g" />
        <span className="ide-title">vivek — ~/career — -zsh</span>
      </div>

      <div className="ide-body">
        <aside className="ide-tree">
          <div className="ide-tree-header">explorer</div>
          <TreeFile id="readme" activeId={activeId} onOpen={open} />
          {folders.map((folder) => (
            <div key={folder}>
              <div className="ide-folder">▾ {folder}/</div>
              {ideFiles
                .filter((f) => f.folder === folder)
                .map((f) => (
                  <TreeFile key={f.id} id={f.id} activeId={activeId} onOpen={open} indent />
                ))}
            </div>
          ))}
        </aside>

        <main className="ide-main">
          <div className="ide-tabs">
            {openIds.map((id) => {
              const f = fileById(id)
              return (
                <button
                  key={id}
                  className={'ide-tab' + (id === activeId ? ' is-active' : '')}
                  onClick={() => setActiveId(id)}
                >
                  <span className="ide-file-dot" style={{ background: f.dot }} />
                  {f.name}
                  <span className="ide-tab-close" onClick={(e) => close(id, e)}>×</span>
                </button>
              )
            })}
            <button className="ide-run" onClick={run} disabled={running}>
              ▶ run
            </button>
          </div>

          <div className="ide-editor">
            {file.lines.map((line, i) => (
              <div key={i} className="ide-line">
                <span className="ide-ln">{i + 1}</span>
                <span className="ide-code">{line}</span>
              </div>
            ))}
          </div>

          <div className="ide-terminal" ref={termRef}>
            <div className="ide-term-header">terminal</div>
            {history.map((h, i) => (
              <div key={i}>
                <div className="ide-term-cmd">
                  <span className="ide-prompt">vivek@portfolio ~ %</span> {h.cmd}
                </div>
                {h.out ? <div className="ide-term-out">{h.out}</div> : null}
              </div>
            ))}
            <div className="ide-term-cmd">
              <span className="ide-prompt">vivek@portfolio ~ %</span>
              <span className="boot-cursor" />
            </div>
          </div>
        </main>
      </div>

      <div className="ide-statusbar">
        <span> main</span>
        <span>{file.lang} · UTF-8 · LF</span>
      </div>
    </div>
  )
}

function TreeFile({ id, activeId, onOpen, indent }) {
  const f = fileById(id)
  return (
    <button
      className={'ide-tree-file' + (id === activeId ? ' is-active' : '') + (indent ? ' is-indented' : '')}
      onClick={() => onOpen(id)}
    >
      <span className="ide-file-dot" style={{ background: f.dot }} />
      {f.name}
    </button>
  )
}
