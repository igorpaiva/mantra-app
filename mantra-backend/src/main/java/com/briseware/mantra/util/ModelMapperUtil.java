package com.briseware.mantra.util;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ModelMapperUtil {

    /**
     * Model mapper.
     */
    protected static final ModelMapper MODEL_MAPPER = createModelMapper();

    private ModelMapperUtil() {
    }

    static ModelMapper createModelMapper() {
        final ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return mapper;
    }

    public static <S, D> D mapTo(S source, Class<D> destClass) {
        return MODEL_MAPPER.map(source, destClass);
    }

    public static <D, S> List<D> toList(List<S> items, Class<D> destClass) {
        final List<D> dests = new ArrayList<>();

        if (items != null) {
            items.forEach(item -> dests.add(mapTo(item, destClass)));
        }
        return dests;
    }

    public static <D, S> Set<D> toSet(Set<S> items, Class<D> destClass) {
        final Set<D> dests = new HashSet<>();

        if (items != null) {
            items.forEach(item -> dests.add(mapTo(item, destClass)));
        }
        return dests;
    }

    public static <S, D> void updateNonNullFields(S source, D destination) {
        ModelMapper mapper = createModelMapper();
        mapper.getConfiguration().setSkipNullEnabled(true);
        mapper.map(source, destination);
    }

}
