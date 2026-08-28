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

interface ScaleData {
    id: number;
    grade: string;
    min_percentage: number;
    max_percentage: number;
    gpa_point: number | string;
}

interface ScaleProps {
    scales: ScaleData[];
}

export default function GradingScale({ scales = [] }: ScaleProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedScale, setSelectedScale] = useState<ScaleData | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        grade: '',
        min_percentage: 0,
        max_percentage: 100,
        gpa_point: 0.00,
    });

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (scale: ScaleData) => {
        setModalMode('edit');
        setSelectedScale(scale);
        setData({
            grade: scale.grade || '',
            min_percentage: scale.min_percentage || 0,
            max_percentage: scale.max_percentage || 100,
            gpa_point: parseFloat(scale.gpa_point as string) || 0.00,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (scale: ScaleData) => {
        setSelectedScale(scale);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/grading-scale/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/grading-scale/${selectedScale?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedScale) {
            destroy(`/grading-scale/${selectedScale.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedScale(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Grading Scales Config" />
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
                                    <BreadcrumbPage>Grading Scales</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>
                            Add Grade Rule
                        </Button>
                    </div>
                </div>

                <div className="Grading-table">
                    <Card>
                        <CardHeader>Grading Scales</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Grade Code</TableHead>
                                        <TableHead>Minimum Score (%)</TableHead>
                                        <TableHead>Maximum Score (%)</TableHead>
                                        <TableHead>GPA Point Value</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                No grading scale rules configured. Add one now!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        scales.map((scale: ScaleData) => (
                                            <TableRow key={scale.id}>
                                                <TableCell className="font-bold text-lg">{scale.grade}</TableCell>
                                                <TableCell className="font-medium">{scale.min_percentage}%</TableCell>
                                                <TableCell className="font-medium">{scale.max_percentage}%</TableCell>
                                                <TableCell className="font-medium">
                                                    {parseFloat(scale.gpa_point as string).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <Ellipsis className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-[160px]">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => openEditModal(scale)}>
                                                                    Edit Rule
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDeleteModal(scale)} className="text-destructive focus:text-destructive">
                                                                    Delete Rule
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
                        </CardContent>
                    </Card>
                </div>

                {/* Create / Edit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Grade Rule' : 'Edit Grade Rule'}</DialogTitle>
                            <DialogDescription>
                                Set boundaries and points for this letter grade.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleModalSubmit} className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="grade">Grade Code</Label>
                                <Input
                                    id="grade"
                                    placeholder="e.g. A, A+, B, Fail"
                                    value={data.grade}
                                    onChange={(e) => setData('grade', e.target.value)}
                                    required
                                />
                                {errors.grade && <p className="text-xs text-destructive">{errors.grade}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="min_percentage">Min Score (%)</Label>
                                    <Input
                                        id="min_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.min_percentage}
                                        onChange={(e) => setData('min_percentage', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.min_percentage && <p className="text-xs text-destructive">{errors.min_percentage}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="max_percentage">Max Score (%)</Label>
                                    <Input
                                        id="max_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.max_percentage}
                                        onChange={(e) => setData('max_percentage', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.max_percentage && <p className="text-xs text-destructive">{errors.max_percentage}</p>}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gpa_point">GPA Point Equivalent</Label>
                                <Input
                                    id="gpa_point"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="10.00"
                                    value={data.gpa_point}
                                    onChange={(e) => setData('gpa_point', parseFloat(e.target.value) || 0.00)}
                                    required
                                />
                                {errors.gpa_point && <p className="text-xs text-destructive">{errors.gpa_point}</p>}
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

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Delete Grade Rule</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the grading scale rule for "{selectedScale?.grade}"? This might cause gaps in report card letter calculations. This action cannot be undone.
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
