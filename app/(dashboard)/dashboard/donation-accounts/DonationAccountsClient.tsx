
"use client";

import { useState } from "react";
import {
  Building2,
  CreditCard,
  Landmark,
  MapPin,
  Plus,
  Save,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

import {
  createDonationAccount,
  updateDonationAccount,
  deleteDonationAccount,
} from "./actions";

export type DonationAccountItem = {
  id: string;
  accountName: string;
  providerName: string;
  accountNumber: string;
  bankAddress: string | null;
  createdAt: string;
};

type Props = {
  accounts: DonationAccountItem[];
};

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10";

function Field({
  label,
  name,
  defaultValue = "",
  placeholder,
  required = false,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder: string;
  required?: boolean;
  maxLength: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={inputClass}
      />
    </label>
  );
}

export default function DonationAccountsClient({ accounts }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAccounts = accounts.filter((account) =>
    [
      account.accountName,
      account.providerName,
      account.accountNumber,
      account.bankAddress ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="overflow-hidden rounded-2xl bg-emerald-950 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Haor Rokkha Andolan
              </p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                Donation Accounts
              </h1>
              <p className="mt-1 max-w-xl text-sm text-emerald-100/75">
                Manage bank accounts, mobile financial services, and other
                donation methods.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreate(!showCreate);
              setEditingId(null);
            }}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50"
          >
            {showCreate ? <X size={17} /> : <Plus size={17} />}
            {showCreate ? "Close Form" : "Add Account"}
          </button>
        </div>

        <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-3">
          <div className="px-5 py-4 sm:px-7">
            <p className="text-xs text-emerald-200/70">Total accounts</p>
            <p className="mt-1 text-2xl font-bold">{accounts.length}</p>
          </div>
          <div className="border-l border-white/10 px-5 py-4 sm:px-7">
            <p className="text-xs text-emerald-200/70">Payment methods</p>
            <p className="mt-1 text-2xl font-bold">
              {new Set(accounts.map((account) => account.providerName.toLowerCase())).size}
            </p>
          </div>
          <div className="col-span-2 hidden border-l border-white/10 px-5 py-4 sm:block sm:px-7">
            <p className="text-xs text-emerald-200/70">Account management</p>
            <p className="mt-2 text-sm font-medium">Admin access only</p>
          </div>
        </div>
      </header>

      {showCreate && (
        <section className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus size={18} className="text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">
              Add a Donation Account
            </h2>
          </div>

          <form
            action={createDonationAccount}
            onSubmit={() => setShowCreate(false)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Field
              label="Account Name"
              name="accountName"
              placeholder="Haor Rokkha Andolan"
              required
              maxLength={150}
            />
            <Field
              label="Provider / Account Type"
              name="providerName"
              placeholder="bKash, Nagad, Bank..."
              required
              maxLength={150}
            />
            <Field
              label="Account Number"
              name="accountNumber"
              placeholder="Enter account number"
              required
              maxLength={100}
            />
            <Field
              label="Bank / Account Address"
              name="bankAddress"
              placeholder="Branch or address (optional)"
              maxLength={500}
            />

            <div className="flex justify-end gap-2 sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-bold text-white transition hover:bg-emerald-900"
              >
                <Plus size={16} />
                Save Account
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Registered Accounts
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Add any provider, or update account details at any time.
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search accounts..."
            aria-label="Search donation accounts"
            className={`${inputClass} sm:max-w-xs`}
          />
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Wallet size={30} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-bold text-slate-700">
              {accounts.length === 0
                ? "No donation accounts added yet"
                : "No matching accounts"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {accounts.length === 0
                ? "Add your first bank or mobile payment account."
                : "Try another name, provider, or account number."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-2012.5 border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-600">
                  <th className="w-14 px-4 py-3 text-center font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Account</th>
                  <th className="px-4 py-3 font-semibold">Provider</th>
                  <th className="px-4 py-3 font-semibold">Account Number</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="w-36 px-4 py-3 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((account, index) => (
                  <tr key={account.id} className="align-top hover:bg-emerald-50/30">
                    <td className="px-4 py-4 text-center text-xs text-slate-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                          <Building2 size={17} />
                        </span>
                        <span className="max-w-48 text-sm font-semibold text-slate-800">
                          {account.accountName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800">
                        <CreditCard size={13} />
                        {account.providerName}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-mono text-sm text-slate-700">
                      {account.accountNumber}
                    </td>

                    <td className="max-w-48 px-4 py-4 text-xs leading-5 text-slate-500">
                      {account.bankAddress || "—"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(
                              editingId === account.id ? null : account.id
                            );
                            setShowCreate(false);
                          }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          {editingId === account.id ? (
                            <X size={14} />
                          ) : (
                            <Save size={14} />
                          )}
                          {editingId === account.id ? "Close" : "Edit"}
                        </button>

                        <form
                          action={deleteDonationAccount}
                          onSubmit={(event) => {
                            if (
                              !window.confirm(
                                `Permanently delete the donation account "${account.accountName}" (${account.providerName})?`
                              )
                            ) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={account.id} />
                          <button
                            type="submit"
                            aria-label={`Delete ${account.accountName}`}
                            title="Delete account"
                            className="flex size-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingId && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {accounts
            .filter((account) => account.id === editingId)
            .map((account) => (
              <div key={account.id}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Edit Donation Account
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Update the account details below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Close edit form"
                    className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  >
                    <X size={17} />
                  </button>
                </div>

                <form
                  action={updateDonationAccount}
                  onSubmit={() => setEditingId(null)}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <input type="hidden" name="id" value={account.id} />
                  <Field
                    label="Account Name"
                    name="accountName"
                    defaultValue={account.accountName}
                    placeholder="Account name"
                    required
                    maxLength={150}
                  />
                  <Field
                    label="Provider / Account Type"
                    name="providerName"
                    defaultValue={account.providerName}
                    placeholder="bKash, Nagad, Bank..."
                    required
                    maxLength={150}
                  />
                  <Field
                    label="Account Number"
                    name="accountNumber"
                    defaultValue={account.accountNumber}
                    placeholder="Account number"
                    required
                    maxLength={100}
                  />
                  <Field
                    label="Bank / Account Address"
                    name="bankAddress"
                    defaultValue={account.bankAddress ?? ""}
                    placeholder="Branch or address (optional)"
                    maxLength={500}
                  />

                  <div className="flex justify-end sm:col-span-2 lg:col-span-4">
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-bold text-white transition hover:bg-emerald-900"
                    >
                      <Save size={16} />
                      Update Account
                    </button>
                  </div>
                </form>
              </div>
            ))}
        </section>
      )}

      <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-xs text-slate-400">
        <MapPin size={13} />
        Haor Rokkha Andolan · Donation Management
      </p>
    </div>
  );
}
