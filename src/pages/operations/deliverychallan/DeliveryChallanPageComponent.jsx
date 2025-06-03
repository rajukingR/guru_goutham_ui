import React from 'react';

const DeliveryChallanPageComponent = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header Color Bar */}
        <div className="h-2 bg-gradient-to-r from-slate-600 via-slate-600 to-blue-400"></div>
        
        {/* Company Header */}
        <div className="p-5 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <div>
              <div className="text-orange-500 text-2xl font-bold">Guru Goutam Infotech Pvt. Ltd.</div>
              <div className="text-xs text-gray-600 mt-1">
                CIN: U72200KA2008PTC047679<br />
                GST: 29AADCG2608Q1Z6
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-400 text-4xl font-bold tracking-wider">DELIVERY CHALLAN</div>
            <div className="text-xs text-gray-600 mt-2">
              Challan No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 8100<br />
              Challan Date. &nbsp;&nbsp;&nbsp;: 29/June/2024
            </div>
          </div>
        </div>
        
        {/* Recipient Section */}
        <div className="bg-slate-200 px-5 py-4">
          <div className="flex justify-between">
            <div className="text-xs text-gray-800">
              <div className="font-bold mb-1">To</div>
              M/s.Prowess Resource Pvt Ltd.<br />
              #10A/29, 1st Floor, 9th Main, 50 Feet Road,<br />
              Hanumanthnagar Bengaluru, Karnataka-560050
            </div>
            <div className="grid grid-cols-4 gap-5 text-xs text-gray-600">
              <div>
                <div className="font-bold text-gray-800 mb-1">Customer Code :</div>
                267
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Contact Person :</div>
                Mr. Satish Roa
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Received Person :</div>
                Mr. Satish Roa
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Delivered Staff :</div>
                Mr. Kesavulu
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">PO Number:</div>
                Mail Confirmation
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Contact Number :</div>
                9123456789
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Contact Number :</div>
                9123456789
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1">Vehicle Number :</div>
                KA 05 AD 9956
              </div>
            </div>
          </div>
        </div>
        
        {/* Items Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-slate-600 text-white p-3 text-left font-bold text-xs w-16 text-center">NO.</th>
              <th className="bg-blue-400 text-white p-3 text-left font-bold text-xs">PARTICULARS</th>
              <th className="bg-blue-400 text-white p-3 text-center font-bold text-xs w-20">QTY</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200 bg-slate-100">
              <td className="p-4 text-center font-bold text-xs">1</td>
              <td className="p-4 text-xs">
                <div className="font-bold mb-1">Desktop With Following Configuration:</div>
                <div className="text-gray-600 text-xs leading-relaxed">
                  Intel Core i9 12th Gen, Processor Gigabyte Z-690UD Motherboard 12GB RAM<br />
                  & 512GB SSD with 850w SMPS 24inch Monitor with Keyboard & Mouse
                </div>
              </td>
              <td className="p-4 text-center font-bold text-xs">1</td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-200">
              <td className="p-4 text-center font-bold text-xs">2</td>
              <td className="p-4 text-xs"></td>
              <td className="p-4 text-center font-bold text-xs">0</td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-100">
              <td className="p-4 text-center font-bold text-xs">3</td>
              <td className="p-4 text-xs"></td>
              <td className="p-4 text-center font-bold text-xs">0</td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-200">
              <td className="p-4 text-center font-bold text-xs">4</td>
              <td className="p-4 text-xs"></td>
              <td className="p-4 text-center font-bold text-xs">0</td>
            </tr>
            <tr className="border-b border-slate-200 bg-slate-100">
              <td className="p-4 text-center font-bold text-xs">5</td>
              <td className="p-4 text-xs"></td>
              <td className="p-4 text-center font-bold text-xs">0</td>
            </tr>
          </tbody>
        </table>
        
        {/* Footer Info */}
        <div className="p-5 flex justify-between items-end">
          <div className="text-xs text-gray-600">
            PAN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: AADCG2608Q<br />
            TIN No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 895674589689
          </div>
          <div className="flex items-center">
            <div className="bg-blue-400 text-white px-4 py-2 text-sm font-bold">TOTAL QTY :</div>
            <div className="bg-slate-600 text-white px-4 py-2 text-lg font-bold min-w-12 text-center">1</div>
          </div>
        </div>
        
        {/* Not For Sale */}
        <div className="text-center text-sm font-bold text-gray-800 my-5">
          NOT FOR SALE - RETURNABLE BASIS ONLY
        </div>
        
        {/* Signature Section */}
        <div className="px-5 pb-5 flex justify-between items-start text-xs text-gray-600">
          <div className="w-1/2">
            <div className="mb-3 text-gray-800">Note: Subjected to Bengaluru Jurisdiction</div>
            <table className="w-full border-collapse border border-gray-300">
              <tr>
                <td className="border border-gray-300 p-4 font-bold bg-white">Delivery Address</td>
                <td className="border border-gray-300 p-4 font-bold bg-white">Receiver Date and Signature</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 h-20 bg-white"></td>
                <td className="border border-gray-300 p-4 h-20 bg-white"></td>
              </tr>
            </table>
          </div>
          <div className="text-center ml-8">
            <div className="mb-3 text-gray-800">For Guru Goutham Infotech Private Limited</div>
            <div className="w-48 h-24 border border-gray-300 flex items-center justify-center text-gray-600 text-sm bg-white">
              SD/-
            </div>
            <div className="mt-3 text-xs text-gray-800">Authorised Signatory</div>
          </div>
        </div>
        
        {/* Company Footer */}
        <div className="bg-slate-700 text-white px-5 py-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              No. 8, 2nd Cross, Diagonal Road, 3rd Block,<br />
              Jayanagar Bengaluru-560011.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <span>gurugoutam.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span>080-2242 9955, +91 9449 0789 55</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <span>info@gurugoutam.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryChallanPageComponent;