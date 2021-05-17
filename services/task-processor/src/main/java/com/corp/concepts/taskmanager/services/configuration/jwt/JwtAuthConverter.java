package com.corp.concepts.taskmanager.services.configuration.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Value("${custom.security.provider.jwt.claim.key}")
    private String resourceKey;

    @Value("${custom.security.provider.jwt.role.key}")
    private String roleKey;

    private Collection<? extends GrantedAuthority> extractResourceRoles(final Jwt jwt) {
        Map<String, Collection<String>> resourceAccess = jwt.getClaim(resourceKey);
        Collection<String> resourceRoles;

        if (resourceAccess != null && (resourceRoles = resourceAccess.get(roleKey)) != null) {
            return resourceRoles.stream().map(x -> new SimpleGrantedAuthority("ROLE_" + x)).collect(Collectors.toSet());
        }

        return Collections.emptySet();
    }

    @Override
    public AbstractAuthenticationToken convert(Jwt source) {
        Collection<GrantedAuthority> authorities = Stream
                .concat(defaultGrantedAuthoritiesConverter.convert(source).stream(),
                        extractResourceRoles(source).stream())
                .collect(Collectors.toSet());

        return new JwtAuthenticationToken(source, authorities);
    }

}
