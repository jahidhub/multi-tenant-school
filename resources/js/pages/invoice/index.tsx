import { Head, useForm, router, Link } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Pagination } from '@/components/pagination';

interface StudentData {
    id: number;
    name: string;
    roll_number: string;
    class: string;
}

interface FeeStructureData {
    id: number;
    term: string;
}

interface InvoiceData {
    id: number;
    student_id: number;
    fee_structure_id: number;
    amount_due: number | string;
    amount_paid: number | string;
    status: 'unpaid' | 'partial' | 'paid' | 'overdue';
    due_date: string;
    student?: StudentData | null;
    fee_structure?: FeeStructureData | null;
}

interface InvoiceProps {
    invoices: {
        data: InvoiceData[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    students: StudentData[];
    feeStructures: { id: number; term: string; class: string }[];
    filters: {
        status: string;
        search: string;
    };
}

export default function InvoiceList({ invoices, students, feeStructures, filters }: InvoiceProps) {
    const list = invoices?.data || [];

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Record Payment Form
    const paymentForm = useForm({
        amount: '' as number | '',
        method: 'Cash',
        paid_at: new Date().toISOString().split('T')[0],
        reference_no: '',
    });

    // Create Manual Invoice Form
    const createForm = useForm({
        student_id: '',
        fee_structure_id: '',
    });

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        const sendStatus = status === 'all_statuses' ? '' : status;
        router.get('/invoices', { status: sendStatus, search: searchQuery }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/invoices', { status: statusFilter === 'all_statuses' ? '' : statusFilter, search: searchQuery }, { preserveState: true });
    };

    const openPaymentModal = (invoice: InvoiceData) => {
        setSelectedInvoice(invoice);
        const remaining = parseFloat(invoice.amount_due as string) - parseFloat(invoice.amount_paid as string);
        paymentForm.setData({
            amount: remaining,
            method: 'Cash',
            paid_at: new Date().toISOString().split('T')[0],
            reference_no: '',
        });
        paymentForm.clearErrors();
        setIsPaymentOpen(true);
    };

    const openDeleteModal = (invoice: InvoiceData) => {
        setSelectedInvoice(invoice);
        setIsDeleteOpen(true);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInvoice) {
            paymentForm.post(`/invoice/${selectedInvoice.id}/record-payment`, {
                onSuccess: () => {
                    setIsPaymentOpen(false);
                    paymentForm.reset();
                },
            });
        }
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInvoice) {
            router.delete(`/invoice/${selectedInvoice.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedInvoice(null);
                },
            });
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/invoice/store', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
                return { backgroundColor: '#16a34a', color: '#ffffff' }; // green
            case 'partial':
                return { backgroundColor: '#ea580c', color: '#ffffff' }; // orange
            case 'overdue':
                return { backgroundColor: '#dc2626', color: '#ffffff' }; // red
            default:
                return { backgroundColor: '#4b5563', color: '#ffffff' }; // gray (unpaid)
        }
    };

    return (
        <>
            <Head title="Student Invoices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="breadcrumb flex items-center justify-between">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Invoices</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            Create Invoice
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Search student / roll no..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-xs"
                        />
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Label htmlFor="statusFilter">Status Filter:</Label>
                        <Select value={statusFilter || 'all_statuses'} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all_statuses">All Statuses</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="Invoice-table">
                    <Card>
                        <CardHeader>Student Bills Ledger</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No.</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Billing Term</TableHead>
                                        <TableHead>Total Due</TableHead>
                                        <TableHead>Total Paid</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                                No invoices matching filters found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        list.map((inv: InvoiceData, index: number) => {
                                            const totalDue = parseFloat(inv.amount_due as string);
                                            const totalPaid = parseFloat(inv.amount_paid as string);
                                            return (
                                                <TableRow key={inv.id}>
                                                    <TableCell className="font-medium">
                                                        {(invoices.current_page - 1) * invoices.per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-bold">
                                                        <Link href={`/students/${inv.student_id}`} className="hover:underline text-blue-600 dark:text-blue-400">
                                                            {inv.student?.name} (Roll: {inv.student?.roll_number})
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{inv.student?.class}</TableCell>
                                                    <TableCell>{inv.fee_structure?.term}</TableCell>
                                                    <TableCell className="font-bold">${totalDue.toFixed(2)}</TableCell>
                                                    <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                        ${totalPaid.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                                            style={getStatusStyle(inv.status)}
                                                        >
                                                            {inv.status.toUpperCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{inv.due_date}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <Ellipsis className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-[180px]">
                                                                <DropdownMenuGroup>
                                                                    {inv.status !== 'paid' && (
                                                                        <DropdownMenuItem onClick={() => openPaymentModal(inv)}>
                                                                            Record Payment
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem onClick={() => openDeleteModal(inv)} className="text-destructive focus:text-destructive">
                                                                        Delete Invoice
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>

                            {list.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={invoices.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Create Manual Invoice Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Issue Student Invoice</DialogTitle>
                            <DialogDescription>
                                Create an individual invoice for a student.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="student_id">Select Student</Label>
                                <Select
                                    value={createForm.data.student_id}
                                    onValueChange={(val) => createForm.setData('student_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                {student.name} (Class: {student.class}, Roll: {student.roll_number})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.student_id && <p className="text-xs text-destructive">{createForm.errors.student_id}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="fee_structure_id">Select Fee Structure</Label>
                                <Select
                                    value={createForm.data.fee_structure_id}
                                    onValueChange={(val) => createForm.setData('fee_structure_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Fee Structure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {feeStructures.map((fs) => (
                                            <SelectItem key={fs.id} value={fs.id.toString()}>
                                                {fs.term} (Class: {fs.class})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {createForm.errors.fee_structure_id && <p className="text-xs text-destructive">{createForm.errors.fee_structure_id}</p>}
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createForm.processing}>
                                    Generate Invoice
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Record Payment Dialog */}
                <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                            <DialogDescription>
                                Log invoice payment for <strong>{selectedInvoice?.student?.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Payment Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={selectedInvoice ? parseFloat(selectedInvoice.amount_due as string) - parseFloat(selectedInvoice.amount_paid as string) : undefined}
                                    value={paymentForm.data.amount}
                                    onChange={(e) => paymentForm.setData('amount', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                    required
                                />
                                {paymentForm.errors.amount && <p className="text-xs text-destructive">{paymentForm.errors.amount}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="method">Payment Method</Label>
                                <Select
                                    value={paymentForm.data.method}
                                    onValueChange={(val) => paymentForm.setData('method', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Cash" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="bKash">bKash</SelectItem>
                                        <SelectItem value="Nagad">Nagad</SelectItem>
                                    </SelectContent>
                                </Select>
                                {paymentForm.errors.method && <p className="text-xs text-destructive">{paymentForm.errors.method}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paid_at">Payment Date</Label>
                                <Input
                                    id="paid_at"
                                    type="date"
                                    value={paymentForm.data.paid_at}
                                    onChange={(e) => paymentForm.setData('paid_at', e.target.value)}
                                    required
                                />
                                {paymentForm.errors.paid_at && <p className="text-xs text-destructive">{paymentForm.errors.paid_at}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="reference_no">Reference No / Txn ID</Label>
                                <Input
                                    id="reference_no"
                                    placeholder="e.g. TXN98725, Check #102"
                                    value={paymentForm.data.reference_no}
                                    onChange={(e) => paymentForm.setData('reference_no', e.target.value)}
                                />
                                {paymentForm.errors.reference_no && <p className="text-xs text-destructive">{paymentForm.errors.reference_no}</p>}
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsPaymentOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={paymentForm.processing}>
                                    Save Payment
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Invoice</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this invoice? Related payment transactions will be permanently deleted. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit}>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive">
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
