import { supabase } from './supabase'

// Mapping: app (camelCase) <-> DB (snake_case)
function toDb(tx) {
  return {
    id:          tx.id,
    type:        tx.type,
    amount:      tx.amount,
    category_id: tx.categoryId,
    note:        tx.note ?? '',
    date:        tx.date,
    created_at:  tx.createdAt,
  }
}

function fromDb(row) {
  return {
    id:         row.id,
    type:       row.type,
    amount:     row.amount,
    categoryId: row.category_id,
    note:       row.note,
    date:       row.date,
    createdAt:  row.created_at,
  }
}

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromDb)
}

export async function insertTransaction(tx) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(toDb(tx))
    .select()
    .single()
  if (error) throw error
  return fromDb(data)
}

export async function updateTransaction(id, changes) {
  const { data, error } = await supabase
    .from('transactions')
    .update(toDb({ ...changes, id }))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return fromDb(data)
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  if (error) throw error
}
