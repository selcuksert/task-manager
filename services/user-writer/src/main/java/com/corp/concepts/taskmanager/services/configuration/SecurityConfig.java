package com.corp.concepts.taskmanager.services.configuration;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.jwt.Jwt;

import com.corp.concepts.taskmanager.services.configuration.jwt.JwtAuthConverter;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	private Converter<Jwt, AbstractAuthenticationToken> converter;
	
	public SecurityConfig(JwtAuthConverter converter) {
		this.converter = converter;
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().disable().authorizeRequests()
		.antMatchers("/api/user/writer").hasRole("manager")
		.anyRequest().denyAll().and()
		.oauth2ResourceServer().jwt()
		.jwtAuthenticationConverter(converter);
	}

}