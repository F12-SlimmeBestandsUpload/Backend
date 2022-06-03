module.exports = (awsSdk, shouldMock, region, bucket, accessKey, secretKey) => {
	/*console.log(awsSdk);
	console.log(shouldMock);
	console.log(region)
	console.log(bucket)
	console.log(accessKey)
	console.log(secretKey)*/

	class AwsS3 {
		constructor(awsSdk, shouldMock, region, bucket, accessKey, secretKey) {
			if (typeof shouldMock == 'string') {
				shouldMock = (shouldMock === 'true');
			}
			this.uuid = require('uuid').v4;
			this.Buffer = require('node:buffer').Buffer;
			this.sdk = awsSdk;
			this.inMemoryStorage = [];
			this.isMock = shouldMock;
			this.buffer = null;
			this._resetBuffer();
			this._setAws(region, bucket, accessKey, secretKey)
		}

		_setAws(region, bucket, accessKey, secretKey) {
			if (this.isMock) {
				return;
			}
			this.region = region;
			this.bucket = bucket;
			this.accessKey = accessKey;
			this.secretKey = secretKey;
			this.client = new this.sdk.S3Client({
			 	region: this.region,
			 	credentials: {
			 		accessKeyId: accessKey,
			 		secretAccessKey: secretKey
			 	}
			});
		}

		// GEBRUIK DIT
		async uniquePost(file) {
			let id = this.uuid();
			await this.post(id, file);
			return id;
		}

		async post(fileName, file) {

			console.log(this.isMock);
			if (this.isMock) {
				return await this._mockPost(fileName, file);
			}
			const params = {
			  Bucket: this.bucket,
			  Key: fileName,
			  Body: file,
			};
			const command = new this.sdk.PutObjectCommand(params);
			try {
				const data = await this.client.send(command);
			} catch (error) {
			  	console.log(error);
			}
		}

		async _mockPost(fileName, file) {
			this.inMemoryStorage[fileName] = this.Buffer.from(file);
		}

		async get(fileName) {
			if (this.isMock) {
				return await this._mockGet(fileName);
			}
			const params = {
			  Bucket: this.bucket,
			  Key: fileName,
			};
			const command = new this.sdk.GetObjectCommand(params);
			this._resetBuffer();
			return new Promise(async (resolve, reject) => {
				try {

					let response = await this.client.send(command);

					response.Body.once('error', err => reject(err))

					response.Body.on('data', chunk => this._pasteBuffer(chunk))

					response.Body.once('end', () => resolve(this.buffer))

				} catch (error) {
				  	return resolve(null)
				}
			});
		}

		async _mockGet(fileName) {
			let get = this.inMemoryStorage[fileName];
			return typeof get === 'undefined' ? null : get;
		}

		async delete(fileName) {
			if (this.isMock) {
				return this._mockDelete(fileName);
			}
			const params = {
			  Bucket: this.bucket,
			  Key: fileName,
			};
			const command = new this.sdk.DeleteObjectCommand(params);
			//try {
				const data = await this.client.send(command);
			/*} catch (error) {
			  	console.log(error);
			}*/
		}

		async _mockDelete(fileName) {
			delete this.inMemoryStorage[fileName];
		}

		_resetBuffer() {
			this.buffer = this.Buffer.alloc(0);
		}

		_pasteBuffer(buffer) {
			let size = this.buffer.length + buffer.length;
			this.buffer = this.Buffer.concat([this.buffer, buffer], size);
		}
	}

	return new AwsS3(awsSdk, shouldMock, region, bucket, accessKey, secretKey);
};