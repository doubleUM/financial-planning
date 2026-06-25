"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Trash2, Pencil, Check, X, AlertTriangle } from "lucide-react"
import {
  getCategories,
  addCategory,
  deleteCategory,
  renameCategory,
  getCategoryExpenseCount,
  type CategoryData,
} from "@/app/dashboard/expenses/actions"
import styles from "./CategoryManager.module.css"

const EMOJI_OPTIONS = ["🍔", "🚗", "🛒", "💡", "🎬", "💪", "📦", "🏠", "✈️", "📚", "🎮", "☕", "👗", "💊", "🎁", "🐶", "🎵", "💼"]

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Add form state
  const [newName, setNewName] = useState("")
  const [newEmoji, setNewEmoji] = useState("📦")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [addError, setAddError] = useState("")

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmoji, setEditEmoji] = useState("")
  const [showEditEmojiPicker, setShowEditEmojiPicker] = useState(false)
  const [editError, setEditError] = useState("")
  const [renameWarningCount, setRenameWarningCount] = useState(0)

  // Delete/reassign state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteExpenseCount, setDeleteExpenseCount] = useState(0)
  const [deleteError, setDeleteError] = useState("")
  const [replacementCategory, setReplacementCategory] = useState("")

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const cats = await getCategories()
    setCategories(cats)
    setLoading(false)
  }

  function handleStartEdit(cat: CategoryData) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditEmoji(cat.emoji)
    setEditError("")
    setRenameWarningCount(0)
    setShowEditEmojiPicker(false)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditError("")
    setRenameWarningCount(0)
    setShowEditEmojiPicker(false)
  }

  async function handleSaveEdit(force = false) {
    if (!editingId) return

    const cat = categories.find(c => c.id === editingId)
    if (!cat) return

    // If name changed, check expenses before renaming
    if (!force && editName.trim() !== cat.name) {
      setEditError("")
      startTransition(async () => {
        const count = await getCategoryExpenseCount(editingId)
        if (count > 0) {
          setRenameWarningCount(count)
        } else {
          executeRename()
        }
      })
      return
    }

    executeRename()
  }

  function executeRename() {
    if (!editingId) return
    startTransition(async () => {
      const result = await renameCategory(editingId, editName, editEmoji)
      if (result.error) {
        setEditError(result.error)
      } else {
        setEditingId(null)
        setEditError("")
        setRenameWarningCount(0)
        setShowEditEmojiPicker(false)
        await loadCategories()
      }
    })
  }

  async function handleAdd() {
    if (!newName.trim()) {
      setAddError("Enter a category name.")
      return
    }
    setAddError("")
    startTransition(async () => {
      const result = await addCategory(newName.trim(), newEmoji)
      if (result.error) {
        setAddError(result.error)
      } else {
        setNewName("")
        setNewEmoji("📦")
        setShowEmojiPicker(false)
        await loadCategories()
      }
    })
  }

  async function handleDeleteInit(cat: CategoryData) {
    setDeleteError("")
    setReplacementCategory("")
    startTransition(async () => {
      const count = await getCategoryExpenseCount(cat.id)
      setDeletingId(cat.id)
      
      if (count > 0) {
        setDeleteExpenseCount(count)
        // Pre-select the first other category
        const otherCats = categories.filter(c => c.id !== cat.id)
        if (otherCats.length > 0) {
          setReplacementCategory(otherCats[0].name)
        }
      } else {
        setDeleteExpenseCount(0)
      }
    })
  }

  async function handleConfirmDelete() {
    if (!deletingId) return
    startTransition(async () => {
      // If there are expenses, we need a replacement category
      if (deleteExpenseCount > 0 && !replacementCategory) return
      
      const result = await deleteCategory(
        deletingId, 
        deleteExpenseCount > 0 ? replacementCategory : undefined
      )
      
      if (result.error) {
        setDeleteError(result.error)
      } else {
        setDeletingId(null)
        setDeleteExpenseCount(0)
        setReplacementCategory("")
        setDeleteError("")
        await loadCategories()
      }
    })
  }

  function handleCancelDelete() {
    setDeletingId(null)
    setDeleteExpenseCount(0)
    setReplacementCategory("")
    setDeleteError("")
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Categories</h3>
        <div className={styles.loading}>Loading categories...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Categories</h3>
      <p className={styles.subtitle}>Manage your expense categories.</p>

      {/* Add new category */}
      <div className={styles.addRow}>
        <div className={styles.emojiPickerWrapper}>
          <button
            type="button"
            className={styles.emojiBtn}
            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowEditEmojiPicker(false) }}
          >
            {newEmoji}
          </button>
          {showEmojiPicker && (
            <div className={styles.emojiGrid}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  className={styles.emojiOption}
                  onClick={() => { setNewEmoji(e); setShowEmojiPicker(false) }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          className={styles.addInput}
          type="text"
          placeholder="New category name..."
          value={newName}
          onChange={e => { setNewName(e.target.value); setAddError("") }}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={isPending}
        >
          <Plus size={18} />
        </button>
      </div>
      {addError && <div className={styles.errorMsg}>{addError}</div>}

      {/* Category list */}
      <div className={styles.list}>
        {categories.map(cat => (
          <div key={cat.id}>
            <div className={styles.categoryRow}>
              {editingId === cat.id ? (
                /* Edit mode */
                <>
                  <div className={styles.emojiPickerWrapper}>
                    <button
                      type="button"
                      className={styles.emojiBtn}
                      onClick={() => { setShowEditEmojiPicker(!showEditEmojiPicker); setShowEmojiPicker(false) }}
                    >
                      {editEmoji}
                    </button>
                    {showEditEmojiPicker && (
                      <div className={styles.emojiGrid}>
                        {EMOJI_OPTIONS.map(e => (
                          <button
                            key={e}
                            type="button"
                            className={styles.emojiOption}
                            onClick={() => { setEditEmoji(e); setShowEditEmojiPicker(false) }}
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    className={styles.editInput}
                    type="text"
                    value={editName}
                    onChange={e => { setEditName(e.target.value); setEditError(""); setRenameWarningCount(0) }}
                    onKeyDown={e => e.key === "Enter" && handleSaveEdit(false)}
                    autoFocus
                  />
                  <button className={styles.confirmBtn} onClick={() => handleSaveEdit(false)} disabled={isPending}>
                    <Check size={16} />
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                /* View mode */
                <>
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <div className={styles.categoryActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleStartEdit(cat)}
                      aria-label="Rename category"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => handleDeleteInit(cat)}
                      disabled={isPending}
                      aria-label="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Edit error */}
            {editingId === cat.id && editError && (
              <div className={styles.inlineError}>{editError}</div>
            )}

            {/* Rename Warning */}
            {editingId === cat.id && renameWarningCount > 0 && (
              <div className={styles.reassignBox}>
                <div className={styles.reassignHeader}>
                  <AlertTriangle size={16} />
                  <span>
                    This category is used by {renameWarningCount} expense{renameWarningCount > 1 ? "s" : ""}.
                    They will all be updated to the new name "{editName}".
                  </span>
                </div>
                <div className={styles.reassignControls}>
                  <button
                    className={styles.reassignBtn}
                    onClick={() => handleSaveEdit(true)}
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Proceed & Update"}
                  </button>
                  <button className={styles.reassignCancel} onClick={() => setRenameWarningCount(0)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Delete Confirmation & Reassign UI */}
            {deletingId === cat.id && (
              <div className={styles.reassignBox}>
                <div className={styles.reassignHeader}>
                  <AlertTriangle size={16} />
                  {deleteExpenseCount > 0 ? (
                    <span>
                      {deleteExpenseCount} expense{deleteExpenseCount > 1 ? "s" : ""} use "{cat.name}".
                      Move them to:
                    </span>
                  ) : (
                    <span>
                      Are you sure you want to delete "{cat.name}"?
                    </span>
                  )}
                </div>
                <div className={styles.reassignControls}>
                  {deleteExpenseCount > 0 && (
                    <select
                      className={styles.reassignSelect}
                      value={replacementCategory}
                      onChange={e => setReplacementCategory(e.target.value)}
                    >
                      {categories.filter(c => c.id !== cat.id).map(c => (
                        <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                      ))}
                    </select>
                  )}
                  <button
                    className={styles.reassignBtn}
                    onClick={handleConfirmDelete}
                    disabled={isPending || (deleteExpenseCount > 0 && !replacementCategory)}
                  >
                    {isPending ? "Processing..." : (deleteExpenseCount > 0 ? "Reassign & Delete" : "Yes, Delete")}
                  </button>
                  <button className={styles.reassignCancel} onClick={handleCancelDelete}>
                    Cancel
                  </button>
                </div>
                {deleteError && <div className={styles.inlineError}>{deleteError}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className={styles.emptyState}>
          No categories yet. Add one above to get started.
        </div>
      )}
    </div>
  )
}
