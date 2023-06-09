// Internal Function
const sendError = (msg, type) => {
	return {
		error: {
			message: msg,
			[type && "type"]: type,
		},
	};
};

const sendSuccess = (msg, specialData) => {
	let sendData = Object.assign(
		{},
		{ message: "success" },
		{ data: msg },
		specialData && { [specialData.title]: specialData.data }
	);
	return sendData;
};

// ===============================================================================

// Export Function
const errorStatusHandler = (res, e, type) => {
	let typeStatus = type ? type : e?.errors?.[0]?.type;

	// console.log("Dev error type status ", typeStatus);
	// console.log("cek 1 ", e?.errors?.[0]?.type);
	// console.log("cek 2 ", e?.original?.code);

	// console.log("FULL ========================", e);

	if (!typeStatus) {
		typeStatus = e?.original?.code;
	}
	if (!typeStatus) {
		typeStatus = e;
	}

	console.log("Last Check ", typeStatus);

	switch (typeStatus) {
		// sequlize error
		case "notNull Violation":
		case "unique violation":
			res.status(400).send(sendError(e.errors[0].message, e.errors[0].type));
			break;

		case "ER_BAD_FIELD_ERROR":
			res.status(400).send(sendError("Error, you search for unknown field !"));
			break;

		case "ER_ROW_IS_REFERENCED_2":
			res.status(400).send(sendError("Tidak dapat menghapus data yang memiliki relasi"));
			break;

		// auth error
		case "no auth":
			res.status(403).send(sendError("No Authorization / Invalid Authorization !"));
			break;

		case "user_disabled":
			res.status(403).send(sendError("Akun anda tidak aktif, mohon hubungi administrator"));
			break;

		case "login_failed":
			res.status(403).send(sendError("Mohon periksa kembali username dan password yang digunakan"));
			break;

		case "compare_failed":
			res.status(403).send(sendError("Kata sandi lama tidak sesuai, mohon periksa kembali kata sandi yang digunakan"));
			break;

		// special case
		case "missing_body":
			res.status(400).send(sendError("Error, Inputan data yang dibutuhkan kurang"));
			break;

		case "not_found":
			res.status(404).send(sendError("Data yang dicari tidak ada"));
			break;

		case "create_failed":
			res.status(500).send(sendError("Error, Gagal membuat data"));
			break;

		case "update_failed":
			res.status(500).send(sendError("Error, Gagal mengedit data"));
			break;

		case "delete_failed":
			res.status(500).send(sendError("Error, Gagal menghapus data"));
			break;

		case "invalid_receive_qty":
			res.status(400).send(sendError("Error, Barang yang diterima melebihi sisa barang yang belum datang"));
			break;

		case "invalid_sold_qty":
			res.status(400).send(sendError("Error, Barang yang dibeli melebihi stock yang tersedia"));
			break;

		case "invalid_return_qty":
			res.status(500).send(sendError("Error, Barang yang direturn melebihi jumlah barang yang dibeli"));
			break;

		case "different_unit":
			res.status(500).send(sendError("Server Error, Kesalahan pada pencocokan unit yang dibeli dengan yang di stock"));
			break;

		case "ID_Not_Found":
			res.status(400).send(sendError("Error, Data ID tidak ditemukan"));
			break;

		case "status_fixed":
			res.status(500).send(sendError("Error, Tidak dapat mengubah status"));
			break;

		case "transaction_closed":
			res.status(400).send(sendError("Transaksi sudah di tutup, tidak dapat melakukan perubahan"));
			break;

		case "super_user_delete":
			res.status(400).send(sendError("Tidak dapat merubah akun statis"));
			break;

		default:
			if (process.env.APP_ENV == "DEV") {
				console.log("Fatal Error : ", e);
				res.status(500).send(sendError("Developer Fatal Error", e));
			} else {
				res.status(500).send(sendError("Server Error"));
			}
			break;
	}

	return null;
};

const successStatusHandler = (res, data, specialData) => {
	if (!data) {
		res.send(sendSuccess([], specialData));
	} else {
		res.send(sendSuccess(data, specialData));
	}
	return null;
};

module.exports = {
	errorStatusHandler,
	successStatusHandler,
};
