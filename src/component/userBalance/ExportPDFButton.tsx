'use client'
import jsPDF from "jspdf";
import "jspdf-autotable";
import {User} from "@prisma/client";

interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

type Props = {
    users: User[];
};

export default function ExportPDFButton({ users }: Props) {
    const exportPDF = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable;

        const tableColumn = ["Name", "Balance"];
        const tableRows = users.map((user) => [
            user.name && user.surname
                ? `${user.name} ${user.surname}`
                : user.username,
            `$${user.balance?.toFixed(2)}`,
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
        });

        const yPos = (doc as any).lastAutoTable.finalY || 20;
        doc.text(`PayID: 0466829412 (T Nguyen)`, 14, yPos + 10);

        doc.save("user_balances.pdf");
    };

    return (
        <button
            onClick={exportPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
            Export PDF
        </button>
    );
}