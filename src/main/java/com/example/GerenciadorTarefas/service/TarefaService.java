package com.example.GerenciadorTarefas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.GerenciadorTarefas.model.Tarefa;
import com.example.GerenciadorTarefas.repository.TarefaRepository;

@Service
public class TarefaService {
    
    @Autowired
    private TarefaRepository repository;

    public List<Tarefa> findAll(){
        return repository.findAll();
    }

    public Tarefa save(Tarefa tarefa){
        return repository.save(tarefa);
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

    public Tarefa update(Long id, Tarefa dados) {   
    Tarefa existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

    existente.setTitulo(dados.getTitulo());
    existente.setResponsavel(dados.getResponsavel());
    existente.setDataTermino(dados.getDataTermino());
    existente.setDetalhamento(dados.getDetalhamento());

    return repository.save(existente);
    }

    public void deletar(Long id) {
    if (!repository.existsById(id)) {
        throw new RuntimeException("Tarefa não encontrada");
    }
    repository.deleteById(id);
    }

}
