/**
 * Copyright © 2013 - 2017 WaveMaker, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wavemaker.runtime.rest.builder;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.wavemaker.runtime.rest.RestConstants;
import com.wavemaker.runtime.rest.model.HttpRequestDetails;
import com.wavemaker.runtime.rest.model.HttpResponseDetails;
import com.wavemaker.runtime.rest.model.Message;
import com.wavemaker.runtime.util.HttpRequestUtils;

/**
 * Created by ArjunSahasranam on 3/9/15.
 */
public class HttpRequestDetailsBuilder {

    private HttpRequestDetails httpRequestDetails;

    private Object requestBody;

    private HttpRequestDetailsBuilder(HttpRequestDetails httpRequestDetails) {
        this.httpRequestDetails = httpRequestDetails;
    }

    public static HttpRequestDetailsBuilder create() {
        return new HttpRequestDetailsBuilder(new HttpRequestDetails());
    }

    public HttpRequestDetailsBuilder setRedirectEnabled(final boolean redirectEnabled) {
        httpRequestDetails.setRedirectEnabled(redirectEnabled);
        return this;
    }

    public HttpRequestDetailsBuilder setHeaders(HttpHeaders headers) {
        httpRequestDetails.getHeaders().putAll(headers);
        return this;
    }

    public HttpRequestDetailsBuilder setMethod(final String method) {
        httpRequestDetails.setMethod(method);
        return this;
    }

    public HttpRequestDetailsBuilder setSampleRestResponse(final HttpResponseDetails sampleHttpResponseDetails) {
        httpRequestDetails.setSampleHttpResponseDetails(sampleHttpResponseDetails);
        return this;
    }

    public HttpRequestDetailsBuilder setRequestBody(final Object requestBody) {
        this.requestBody = requestBody;
        return this;
    }

    public HttpRequestDetailsBuilder setEndpointAddress(final String endpointAddress) {
        httpRequestDetails.setEndpointAddress(endpointAddress);
        return this;
    }

    public HttpRequestDetailsBuilder setBasicAuthorization(final String authorization) {
        httpRequestDetails.getHeaders().set(RestConstants.AUTHORIZATION, authorization);
        return this;
    }

    public HttpRequestDetailsBuilder setContentType(final String contentType) {
        httpRequestDetails.getHeaders().set(HttpHeaders.CONTENT_TYPE, contentType);
        return this;
    }

    public HttpRequestDetails build() {
        if(requestBody!=null) {
            if (requestBody instanceof byte[]) {
                httpRequestDetails.setRequestBody((byte[]) requestBody);
            } else if (requestBody instanceof String) {
                httpRequestDetails.setRequestBody(((String) requestBody).getBytes());
            } else if (requestBody instanceof Map) {
                String contentType = httpRequestDetails.getHeaders().getContentType().toString();
                if (MediaType.APPLICATION_FORM_URLENCODED_VALUE.equals(contentType)) {
                    setRequestBody(HttpRequestUtils.getFormMessage((Map) requestBody));
                }
                if (MediaType.MULTIPART_FORM_DATA_VALUE.equals(contentType)) {
                    setRequestBody(HttpRequestUtils.getMultipartMessage((Map) requestBody));
                }
            } else {
                setRequestBody(HttpRequestUtils.getJsonMessage(requestBody));
            }
        }
        return httpRequestDetails;
    }

    private void setRequestBody(Message message){
        InputStream inputStream = message.getInputStream();
        try {
            httpRequestDetails.setRequestBody(IOUtils.toByteArray(inputStream));
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }
}
