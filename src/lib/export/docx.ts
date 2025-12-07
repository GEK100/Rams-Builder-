import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import type { CDMInfo } from "@/types/cdm";
import type { RiskAssessment, LIKELIHOOD_LABELS, SEVERITY_LABELS } from "@/types/risk";

interface GeneratedSection {
  id: string;
  title: string;
  content: string;
}

interface RAMSExportData {
  cdmInfo: CDMInfo;
  riskAssessments: RiskAssessment[];
  sections: GeneratedSection[];
  generatedDate: string;
}

// Parse markdown content to docx elements
function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const lines = markdown.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      // Empty line - add spacing
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    // Headings
    if (trimmedLine.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
    } else if (trimmedLine.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (trimmedLine.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmedLine.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    }
    // Bullet points
    else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(trimmedLine.substring(2))],
          bullet: { level: 0 },
          spacing: { before: 100, after: 100 },
        })
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      const text = trimmedLine.replace(/^\d+\.\s/, "");
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(text)],
          numbering: { reference: "numbered-list", level: 0 },
          spacing: { before: 100, after: 100 },
        })
      );
    }
    // Bold text handling (**text**)
    else if (trimmedLine.includes("**")) {
      const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/);
      const textRuns: TextRun[] = parts.map((part) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return new TextRun({
            text: part.slice(2, -2),
            bold: true,
          });
        }
        return new TextRun(part);
      });
      paragraphs.push(
        new Paragraph({
          children: textRuns,
          spacing: { before: 100, after: 100 },
        })
      );
    }
    // Regular paragraph
    else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(trimmedLine)],
          spacing: { before: 100, after: 100 },
        })
      );
    }
  }

  return paragraphs;
}

// Create title page
function createTitlePage(cdmInfo: CDMInfo, generatedDate: string): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "RISK ASSESSMENT AND",
          bold: true,
          size: 72,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2000, after: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "METHOD STATEMENT",
          bold: true,
          size: 72,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "(RAMS)",
          bold: true,
          size: 48,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: cdmInfo.project.title || "Construction Project",
          bold: true,
          size: 56,
          color: "10b981",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${cdmInfo.project.siteAddress.line1}`,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${cdmInfo.project.siteAddress.city}, ${cdmInfo.project.siteAddress.postcode}`,
          size: 28,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Client: ${cdmInfo.client.name}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Principal Contractor: ${cdmInfo.principalContractor.name}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Document Date: ${generatedDate}`,
          size: 20,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Project Reference: ${cdmInfo.project.reference || "TBC"}`,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ];
}

// Create document control table
function createDocumentControlTable(cdmInfo: CDMInfo, generatedDate: string): Table {
  const borderStyle = {
    style: BorderStyle.SINGLE,
    size: 1,
    color: "CCCCCC",
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Document Title", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: `RAMS - ${cdmInfo.project.title}` })],
            width: { size: 70, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Document Reference", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
          }),
          new TableCell({
            children: [new Paragraph({ text: cdmInfo.project.reference || "TBC" })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Issue Date", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
          }),
          new TableCell({
            children: [new Paragraph({ text: generatedDate })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Version", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
          }),
          new TableCell({
            children: [new Paragraph({ text: "1.0" })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Prepared By", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
          }),
          new TableCell({
            children: [new Paragraph({ text: cdmInfo.principalContractor.name })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Approved By", children: [new TextRun({ bold: true })] })],
            shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
          }),
          new TableCell({
            children: [new Paragraph({ text: "" })],
          }),
        ],
      }),
    ],
  });
}

// Create risk assessment table
function createRiskAssessmentTable(riskAssessments: RiskAssessment[]): (Paragraph | Table)[] {
  if (riskAssessments.length === 0) {
    return [new Paragraph({ text: "No risk assessments have been added." })];
  }

  const elements: (Paragraph | Table)[] = [];

  for (const risk of riskAssessments) {
    elements.push(
      new Paragraph({
        text: risk.hazard?.name || risk.customHazardName || "Unnamed Hazard",
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 300, after: 100 },
      })
    );

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        // Header row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Hazard Description", bold: true })] })],
              shading: { type: ShadingType.SOLID, fill: "10b981", color: "FFFFFF" },
              columnSpan: 4,
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: risk.hazardDescription })],
              columnSpan: 4,
            }),
          ],
        }),
        // Initial risk row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Initial Risk", bold: true })] })],
              shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
            }),
            new TableCell({
              children: [new Paragraph({ text: `Likelihood: ${risk.initialLikelihood}` })],
            }),
            new TableCell({
              children: [new Paragraph({ text: `Severity: ${risk.initialSeverity}` })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `Score: ${risk.initialRiskScore}`, bold: true })] })],
            }),
          ],
        }),
        // Control measures header
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Control Measures", bold: true })] })],
              shading: { type: ShadingType.SOLID, fill: "10b981", color: "FFFFFF" },
              columnSpan: 4,
            }),
          ],
        }),
        // Control measures content
        new TableRow({
          children: [
            new TableCell({
              children: risk.mitigations.length > 0
                ? risk.mitigations.map(
                    (m) =>
                      new Paragraph({
                        children: [new TextRun(`• ${m.mitigation?.name || m.customMitigationText}`)],
                      })
                  )
                : [new Paragraph({ text: "No control measures specified" })],
              columnSpan: 4,
            }),
          ],
        }),
        // Residual risk row
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "Residual Risk", bold: true })] })],
              shading: { type: ShadingType.SOLID, fill: "F0F0F0" },
            }),
            new TableCell({
              children: [new Paragraph({ text: `Likelihood: ${risk.residualLikelihood}` })],
            }),
            new TableCell({
              children: [new Paragraph({ text: `Severity: ${risk.residualSeverity}` })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `Score: ${risk.residualRiskScore}`, bold: true })] })],
            }),
          ],
        }),
      ],
    });

    elements.push(table);
    elements.push(new Paragraph({ text: "" })); // Spacing
  }

  return elements;
}

// Main export function
export async function exportRAMSToWord(data: RAMSExportData): Promise<void> {
  const { cdmInfo, riskAssessments, sections, generatedDate } = data;

  // Build all document sections
  const documentChildren: (Paragraph | Table)[] = [];

  // Title page
  documentChildren.push(...createTitlePage(cdmInfo, generatedDate));

  // Page break
  documentChildren.push(
    new Paragraph({
      text: "",
      pageBreakBefore: true,
    })
  );

  // Document control
  documentChildren.push(
    new Paragraph({
      text: "Document Control",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  );
  documentChildren.push(createDocumentControlTable(cdmInfo, generatedDate));

  // Add each generated section
  for (const section of sections) {
    // Skip the risks section as we'll add our own formatted version
    if (section.id === "risks") {
      documentChildren.push(
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        })
      );
      documentChildren.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        })
      );
      documentChildren.push(...createRiskAssessmentTable(riskAssessments));
    } else {
      documentChildren.push(
        new Paragraph({
          text: "",
          pageBreakBefore: true,
        })
      );
      documentChildren.push(...parseMarkdownToDocx(section.content));
    }
  }

  // Create the document
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Arial",
            size: 22, // 11pt
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
            },
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "numbered-list",
          levels: [
            {
              level: 0,
              format: NumberFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `RAMS - ${cdmInfo.project.title}`,
                    size: 18,
                    color: "888888",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Page ",
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                  }),
                  new TextRun({
                    text: " of ",
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                  }),
                  new TextRun({
                    text: "  |  Generated by RAMS Builder - Ictus Flow",
                    size: 18,
                    color: "888888",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: documentChildren,
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const filename = `RAMS_${cdmInfo.project.title?.replace(/\s+/g, "_") || "Document"}_${generatedDate.replace(/\//g, "-")}.docx`;
  saveAs(blob, filename);
}
