package com.wavemaker.runtime.servicedef.helper;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.wavemaker.studio.common.WMRuntimeException;
import com.wavemaker.studio.common.json.JSONUtils;
import com.wavemaker.studio.common.servicedef.model.ServiceDefinition;

/**
 * @author <a href="mailto:sunil.pulugula@wavemaker.com">Sunil Kumar</a>
 * @since 21/3/16
 */
public class ServiceDefinitionHelper {

    private static final Logger logger = LoggerFactory.getLogger(ServiceDefinitionHelper.class);

    public Map<String, ServiceDefinition> build(InputStream inputStream) {
        if (inputStream == null) {
            throw new WMRuntimeException("Attempt to build service definition from null input stream");
        }
        logger.debug("Building service definitions from InputStream");
        try {
            final String serviceDefJson = IOUtils.toString(inputStream, "UTF-8");
            return buildServiceDef(serviceDefJson);
        } catch (IOException e) {
            throw new WMRuntimeException("Failed to build service def from given stream ", e);
        }
    }

    public Map<String, ServiceDefinition> build(String serviceDefJson) {
        if (serviceDefJson == null) {
            throw new WMRuntimeException("Attempt to build service def from null String");
        }
        logger.debug("Building service definition from json content");
        return buildServiceDef(serviceDefJson);
    }

    private Map<String, ServiceDefinition> buildServiceDef(String serviceDefJson) {
        try {
            Map<String, ServiceDefinition> serviceDefMap = new HashMap<>();
            if (StringUtils.isNotBlank(serviceDefJson)) {
                serviceDefMap = JSONUtils.toObject(serviceDefJson, new TypeReference<HashMap<String, ServiceDefinition>>() {
                });
            }
            return serviceDefMap;
        } catch (IOException e) {
            throw new WMRuntimeException("Failed to build service def from the given json", e);
        }
    }

}