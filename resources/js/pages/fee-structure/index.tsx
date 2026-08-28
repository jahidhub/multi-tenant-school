import { Head, useForm } from '@inertiajs/react';
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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Pagination } from '@/components/pagination';

interface FeeStructureData {
    id: number;
    class: string;
    term: string;
    amount: number | string;
    due_date: string;
}

interface FeeStructureProps {
    feeStructures: {
        data: FeeStructureData[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function FeeStructureList({ feeStructures }: FeeStructureProps) {
    const list = feeStructures?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedStructure, setSelectedStructure] = useState<FeeStructureData | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        class: '',
        term: '',
        amount: '' as number | '',
        due_date: '',
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (fs: FeeStructureData) => {
        setModalMode('edit');
        setSelectedStructure(fs);
        setData({
            class: fs.class || '',
            term: fs.term || '',
            amount: parseFloat(fs.amount as string) || '',
            due_date: fs.due_date || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (fs: FeeStructureData) => {
        setSelectedStructure(fs);
        setIsDeleteOpen(true);
    };

    const openGenerateModal = (fs: FeeStructureData) => {
        setSelectedStructure(fs);
        setIsGenerateOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/fee-structure/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/fee-structure/${selectedStructure?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStructure) {
            destroy(`/fee-structure/${selectedStructure.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedStructure(null);
                },
            });
        }
    };

    const handleGenerateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStructure) {
            post(`/fee-structure/${selectedStructure.id}/generate-invoices`, {
                onSuccess: () => {
                    setIsGenerateOpen(false);
                    setSelectedStructure(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Fee Structures" />
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
                                    <BreadcrumbPage>Fee Structures</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>
                            Add Fee Structure
                        </Button>
                    </div>
                </div>

                <div className="Fee-table">
                    <Card>
                        <CardHeader>Tuition Fee Configurations</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">No.</TableHead>
                                        <TableHead>Class / Grade</TableHead>
                                        <TableHead>Fee Type / Term</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                No fee structures defined. Configure your first billing class!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        list.map((fs: FeeStructureData, index: number) => (
                                            <TableRow key={fs.id}>
                                                <TableCell className="font-medium">
                                                    {(feeStructures.current_page - 1) * feeStructures.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-semibold">{fs.class}</TableCell>
                                                <TableCell className="font-semibold">{fs.term}</TableCell>
                                                <TableCell className="font-bold text-green-600 dark:text-green-400">
                                                    ${parseFloat(fs.amount as string).toFixed(2)}
                                                </TableCell>
                                                <TableCell>{fs.due_date}</TableCell>
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
                                                                <DropdownMenuItem onClick={() => openGenerateModal(fs)}>
                                                                    Generate Invoices
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEditModal(fs)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(fs)} className="text-destructive focus:text-destructive">
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {list.length > 0 && (
                                <div className="mt-4">
                                    <Pagination links={feeStructures.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Create / Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Fee Structure' : 'Edit Fee Structure'}</DialogTitle>
                            <DialogDescription>
                                Set bill amounts per student class and payment term.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleModalSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="class">Class / Grade Target</Label>
                                <Input
                                    id="class"
                                    placeholder="e.g. 10, 11, 12"
                                    value={data.class}
                                    onChange={(e) => setData('class', e.target.value)}
                                    required
                                />
                                {errors.class && <p className="text-xs text-destructive">{errors.class}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="term">Billing Term / Description</Label>
                                <Input
                                    id="term"
                                    placeholder="e.g. Q1 Tuition Fee, Annual Registration"
                                    value={data.term}
                                    onChange={(e) => setData('term', e.target.value)}
                                    required
                                />
                                {errors.term && <p className="text-xs text-destructive">{errors.term}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount">Billing Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                                    required
                                />
                                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    required
                                />
                                {errors.due_date && <p className="text-xs text-destructive">{errors.due_date}</p>}
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {modalMode === 'create' ? 'Create' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Generate Invoices Confirmation Dialog */}
                <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Generate Class Invoices</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to generate bills for all students enrolled in Class <strong>{selectedStructure?.class}</strong>? This action creates individual invoices of <strong>${parseFloat(selectedStructure?.amount as string || '0').toFixed(2)}</strong> for each student.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleGenerateSubmit}>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsGenerateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Generate Bills
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Fee Structure</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this configuration? Student invoices previously generated will remain unaffected. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit}>
                            <DialogFooter className="pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" disabled={processing}>
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
