package com.wavemaker.runtime.data.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.type.AbstractStandardBasicType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.hibernate4.HibernateCallback;
import org.springframework.orm.hibernate4.HibernateTemplate;

import com.wavemaker.runtime.data.dao.util.QueryHelper;
import com.wavemaker.runtime.data.expression.Type;
import com.wavemaker.runtime.data.model.returns.FieldType;
import com.wavemaker.runtime.data.model.returns.ReturnProperty;
import com.wavemaker.runtime.data.spring.WMPageImpl;

public class HQLQueryUtils {

    private static final byte FIELD_NAME = 1;
    private static final byte EXPRESSION = 2;
    private static final byte VALUE = 3;
    private static final String FROM = " from ";
    private static final String WHERE = " where ";
    private static final String ORDER_BY = " order by ";
    private static final String WILDCARD_ENTRY = "%";
    private static final String QUERY_EXPRESSION = "([\\w]+)[\\s]+(startswith|endswith|containing)[\\s][\"']([^']+)+([\"'])";
    private static Pattern pattern = Pattern.compile(QUERY_EXPRESSION);

    public static String buildHQL(String entityClass, String query, Pageable pageable) {
        String queryFilter = StringUtils.EMPTY;
        String orderBy     = StringUtils.EMPTY;
        if(StringUtils.isNotBlank(query)) {
            queryFilter = WHERE + replaceExpressionWithHQL(query);
        }
        if(isSortAppliedOnPageable(pageable)) {
            orderBy = buildOrderByClause(pageable.getSort());
        }
        return FROM + entityClass + queryFilter + orderBy;
    }

    public static String replaceExpressionWithHQL(String query) {
        Matcher matcher = pattern.matcher(query);
        StringBuffer hqlQuery = new StringBuffer();
        while (matcher.find()) {
            String value = "";
            switch (Type.valueFor(matcher.group(EXPRESSION))) {
                case STARTING_WITH:
                    value = matcher.group(VALUE) + WILDCARD_ENTRY;
                    break;
                case ENDING_WITH:
                    value = WILDCARD_ENTRY + matcher.group(VALUE);
                    break;
                case CONTAINING:
                    value = WILDCARD_ENTRY + matcher.group(VALUE) + WILDCARD_ENTRY;
                    break;
            }
            matcher.appendReplacement(hqlQuery, matcher.group(FIELD_NAME) + " like " + "'" + value + "'");
        }
        matcher.appendTail(hqlQuery);
        return hqlQuery.toString();
    }

    public static Query createHQLQuery(String entityClass, String query, Pageable pageable, Session session) {
        Query hqlQuery = session.createQuery(buildHQL(entityClass, query, pageable));
        if(pageable != null) {
            hqlQuery.setFirstResult(pageable.getOffset());
            hqlQuery.setMaxResults(pageable.getPageSize());
        }
        return hqlQuery;
    }

    public static Page executeHQLQuery(final Query hqlQuery, final Map<String, Object> params, final Pageable pageable, final HibernateTemplate template) {

        return template.execute(new HibernateCallback<Page<Object>>() {
            public Page<Object> doInHibernate(Session session) throws HibernateException {
                QueryHelper.setResultTransformer(hqlQuery, Object.class);
                QueryHelper.configureParameters(hqlQuery, params);
                if (pageable != null) {
                    Long count = QueryHelper.getQueryResultCount(hqlQuery.getQueryString(), params, false, template);
                    return new WMPageImpl(hqlQuery.list(), pageable, count);
                }
                return new WMPageImpl(hqlQuery.list());
            }
        });
    }

    public static List<ReturnProperty> extractMetaForHql(final Query query) {
        final org.hibernate.type.Type[] returnTypes = query.getReturnTypes();
        final String[] returnAliases = query.getReturnAliases();
        List<ReturnProperty> properties = new ArrayList<>(returnTypes.length);
        for (int i = 0; i < returnTypes.length; i++) {
            final org.hibernate.type.Type type = returnTypes[i];

            ReturnProperty property = new ReturnProperty();
            if (returnAliases != null && returnAliases.length >= i) {
                property.setName(returnAliases[i]);
            }

            FieldType fieldType = new FieldType();
            String typeRef = type.getName();
            if (type.isCollectionType()) {
                fieldType.setList(true);
            }
            if (type.isAssociationType()) {
                fieldType.setType(FieldType.Type.REFERENCE);
            } else {
                fieldType.setType(FieldType.Type.SIMPLE);
            }
            if (type instanceof AbstractStandardBasicType) {
                typeRef = ((AbstractStandardBasicType) type).getJavaTypeDescriptor().getJavaTypeClass().getName();
            }

            fieldType.setRef(typeRef);
            property.setFieldType(fieldType);

            properties.add(property);
        }
        return properties;
    }

    private static String buildOrderByClause(Sort sort) {
        StringBuilder orderBy = new StringBuilder(ORDER_BY);
        Iterator<Sort.Order> orderItr = sort.iterator();
        while(orderItr.hasNext()) {
            Sort.Order order = orderItr.next();
            orderBy.append(" ")
                    .append(order.getProperty())
                    .append(" ")
                    .append(order.getDirection());
            if(orderItr.hasNext()) {
                orderBy.append(",");
            }
        }
        return orderBy.toString();
    }

    private static boolean isSortAppliedOnPageable(Pageable pageable) {
        return (pageable != null) && (pageable.getSort() != null);
    }
}
