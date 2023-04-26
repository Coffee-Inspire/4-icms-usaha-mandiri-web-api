const generateNote = (type, lastNum) => {
	// Pembelian:
	// UM/PBL/23040001

	// Penjualan:
	// UM//PJL/23040001

	let note = type === "jual" ? "UM/PJL/" : "UM/PBL/";
	let year = addZero(2, String(Math.abs(new Date().getFullYear()) % 100)); //Get last 2 digit from year
	let month = addZero(2, String(Math.abs(new Date().getMonth()) + 1));

	let serialNote = "";
	if (lastNum) {
		let splitSerial = lastNum.split("/").pop();
		let lastYear = splitSerial.slice(0, 2);
		let lastMonth = splitSerial.slice(2, 4);
		let lastSerial = splitSerial.slice(4);

		if (lastYear === year && lastMonth === month) {
			lastSerial = parseInt(lastSerial) + 1;
			serialNote = addZero(4, String(lastSerial));
		} else {
			serialNote = "0001";
		}
	} else {
		serialNote = "0001";
	}

	let generatedSerial = note + "" + year + "" + month + "" + serialNote;

	return generatedSerial;
};

function addZero(format, number) {
	// format and number is STRING
	let serial = "";

	if (number.length < format) {
		for (let i = number.length; i < format; i++) {
			serial = serial.concat("0");
		}
	}

	return serial.concat(number);
}

module.exports = {
	generateNote,
};
