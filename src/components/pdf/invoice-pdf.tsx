import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Invoice, InvoiceItem } from '@prisma/client';

// Register fonts if needed (using default Helvetica for now which is standard PDF font)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  borderBox: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  // Flex Rows
  row: {
    flexDirection: 'row',
  },
  // Cells
  col: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 2,
  },
  lastCol: {
    borderRightWidth: 0,
  },
  headerLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
  },
  sectionHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    padding: 2,
    backgroundColor: '#f0f0f0',
  },
  // Specific sizing matching screenshot approximately
  w50: { width: '50%' },
  w25: { width: '25%' },
  w10: { width: '10%' },
  w15: { width: '15%' },
  w40: { width: '40%' },
});

// Helper for cell with label and value
const Cell = ({ label, value, style, noBorder = false }: { label?: string, value?: string | null, style?: any, noBorder?: boolean }) => (
  <View style={[styles.col, style, noBorder ? styles.lastCol : {}]}>
    {label && <Text style={styles.headerLabel}>{label}</Text>}
    {value && <Text style={styles.value}>{value}</Text>}
  </View>
);

interface InvoicePDFProps {
  invoice: Invoice & { items: InvoiceItem[] };
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Title */}
      <Text style={styles.title}>INVOICE</Text>

      <View style={styles.borderBox}>
        
        {/* Top Header Section */}
        <View style={[styles.row, { borderBottomWidth: 1 }]}>
          {/* Left: Exporter */}
          <View style={[styles.col, styles.w50, { padding: 4 }]}>
             <Text style={styles.headerLabel}>Exporter</Text>
             <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{invoice.exporterName}</Text>
             <Text style={styles.value}>{invoice.exporterAddress}</Text>
          </View>
          
          {/* Right: Details Stack */}
          <View style={[styles.w50]}>
             {/* Row 1 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="INVOICE NO.:" value={invoice.invoiceNo} style={styles.w50} />
               <Cell label="DT." value={new Date(invoice.invoiceDate).toLocaleDateString()} style={styles.w50} noBorder />
             </View>
             {/* Row 2 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="GST NO.:" value={invoice.exporterGstNo} style={styles.w50} />
               <Cell label="I.E.C.:" value={invoice.exporterIec} style={styles.w50} noBorder />
             </View>
             {/* Row 3 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="LUT #" value={invoice.exporterLutNo} style={styles.w50} />
               <Cell label="MODE OF TRANSPORT:" value={invoice.modeOfTransport} style={styles.w50} noBorder />
             </View>
             {/* Row 4 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="State:" value={invoice.state} style={styles.w50} />
               <Cell label="State Code:" value={invoice.stateCode} style={styles.w50} noBorder />
             </View>
             {/* Row 5 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="District Code:" value={invoice.districtCode} style={styles.w50} />
               <Cell label="Trade Agreement Code:" value={invoice.tradeAgreementCode} style={styles.w50} noBorder />
             </View>
             {/* Row 6 */}
             <View style={[styles.row, { borderBottomWidth: 1 }]}>
               <Cell label="Buyer's Order No:" value={invoice.buyersOrderNo} style={styles.w50} />
               <Cell label="PI No.:" value={invoice.piNo} style={styles.w50} noBorder />
             </View>
             {/* Row 7 - Terms */}
             <View style={styles.row}>
               <Cell label="Terms of Payment :" value={invoice.termsOfPayment} style={{ width: '100%' }} noBorder />
             </View>
          </View>
        </View>

        {/* Consignee & Notify */}
        <View style={[styles.row, { borderBottomWidth: 1, minHeight: 80 }]}>
           <View style={[styles.col, styles.w50, { padding: 4 }]}>
              <Text style={styles.headerLabel}>Consignee</Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{invoice.consigneeName}</Text>
              <Text style={styles.value}>{invoice.consigneeAddress}</Text>
           </View>
           <View style={[styles.w50, { padding: 4 }]}>
              <Text style={styles.headerLabel}>Notify</Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{invoice.notifyName}</Text>
              <Text style={styles.value}>{invoice.notifyAddress}</Text>
           </View>
        </View>

        {/* Logistics Grid */}
        <View style={[styles.row, { borderBottomWidth: 1 }]}>
           <Cell label="Pre-carriage by" value={invoice.preCarriageBy} style={styles.w25} />
           <Cell label="Place of Receipt" value={invoice.placeOfReceipt} style={styles.w25} />
           <Cell label="Country of Origin" value={invoice.countryOfOrigin} style={styles.w25} />
           <Cell label="Country of Dest." value={invoice.countryOfDestination} style={styles.w25} noBorder />
        </View>
        <View style={[styles.row, { borderBottomWidth: 1 }]}>
           <Cell label="Vessel / Flight No." value={invoice.vesselFlightNo} style={styles.w25} />
           <Cell label="Port of Loading" value={invoice.portOfLoading} style={styles.w25} />
           <Cell label="Port of Discharge" value={invoice.portOfDischarge} style={styles.w25} />
           <Cell label="Final Destination" value={invoice.finalDestination} style={styles.w25} noBorder />
        </View>

        {/* Items Header */}
        <View style={[styles.row, { borderBottomWidth: 1, backgroundColor: '#eee', fontWeight: 'bold' }]}>
           <Cell label="" value="Marks & Nos" style={{...styles.w15, textAlign: 'center'}} /> // Adjusted width
           <Cell label="" value="HSN" style={{...styles.w10, textAlign: 'center'}} />
           <Cell label="" value="Sr. No." style={{width: '5%', textAlign: 'center'}} />
           <Cell label="" value="Description of Goods" style={{...styles.w40, textAlign: 'center'}} />
           <Cell label="" value="Quantity (in Kgs)" style={{...styles.w10, textAlign: 'center'}} />
           <View style={[styles.col, styles.w10, { padding: 0 }]}>
               <View style={{borderBottomWidth:1, textAlign:'center'}}><Text style={styles.headerLabel}>Rate</Text></View>
               <View style={{textAlign:'center'}}><Text style={styles.value}>USD per Kgs</Text></View>
           </View>
           <View style={[styles.w10, { padding: 0 }]}>
               <View style={{borderBottomWidth:1, textAlign:'center'}}><Text style={styles.headerLabel}>Total Amount</Text></View>
               <View style={{textAlign:'center'}}><Text style={styles.value}>USD</Text></View>
           </View>
        </View>

        {/* Items Rows */}
        {invoice.items.map((item, i) => (
           <View key={i} style={[styles.row, { borderBottomWidth: 1, minHeight: 20 }]}>
               <Cell value={item.marksAndNos} style={{...styles.w15, textAlign: 'center'}} />
               <Cell value={item.hsn} style={{...styles.w10, textAlign: 'center'}} />
               <Cell value={item.srNo} style={{width: '5%', textAlign: 'center'}} />
               <Cell value={item.description} style={styles.w40} />
               <Cell value={item.quantity.toString()} style={{...styles.w10, textAlign: 'right'}} />
               <Cell value={item.rate.toFixed(2)} style={{...styles.w10, textAlign: 'right'}} />
               <Cell value={item.totalAmount.toFixed(2)} style={{...styles.w10, textAlign: 'right'}} noBorder />
           </View>
        ))}
        
        {/* Fill Empty Rows if less items? Optional */}

        {/* Totals */}
        <View style={[styles.row, { borderBottomWidth: 1, minHeight: 20 }]}>
           <View style={{ width: '80%', borderRightWidth: 1, padding: 4, alignItems: 'flex-end', justifyContent: 'center' }}>
               <Text style={{fontWeight:'bold'}}>TOTAL VALUE (CIF)</Text>
           </View>
           <View style={{ width: '20%', padding: 4, alignItems: 'flex-end', justifyContent:'center' }}>
               <Text style={{fontWeight:'bold'}}>{invoice.totalAmountCIF.toFixed(2)}</Text>
           </View>
        </View>

        {/* Amount in Words */}
        <View style={[styles.row, { borderBottomWidth: 1, minHeight: 25, padding: 4 }]}>
           <Text style={{fontWeight:'bold'}}>TOTAL VALUE (in words): USD </Text>
           <Text> {invoice.amountInWords}</Text>
        </View>

        {/* Decoration & Signature */}
        <View style={[styles.row, { minHeight: 100 }]}>
           <View style={[styles.col, { width: '70%', padding: 4 }]}>
               <Text style={{textDecoration:'underline', fontWeight:'bold', marginBottom: 5}}>Declaration:</Text>
               <Text>1. We declare that this invoice shows the actual price of the goods describe that all particulars are true and correct.</Text>
               <Text>2. "We intend to claim reward/benefit under RODTEP & Drawback scheme as applicable"</Text>
           </View>
           <View style={{ width: '30%', padding: 4, justifyContent:'flex-end' }}>
               <Text style={{fontWeight:'bold'}}>Authorised Signatory</Text>
           </View>
        </View>

      </View>
    </Page>
  </Document>
);
